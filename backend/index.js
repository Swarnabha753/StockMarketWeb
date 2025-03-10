require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const { HoldingsModel } = require("./models/HoldingsModel.js");
const { PositionsModel } = require("./models/PositionsModel.js");
const { OrdersModel } = require("./models/OrdersModel");
const authRoutes = require("./routes/authRoutes");

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;
const API_KEY = process.env.MARKET_API_KEY;
const MARKET_API_URL = "https://www.alphavantage.co/query";

const app = express();

app.use(cors({
    origin: [
        "https://stock-market-web-kappa.vercel.app", 
        "https://stock-market-webb.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

// ✅ Function to fetch live market prices
const fetchMarketPrice = async (symbol) => {
    try {
        const response = await axios.get(`${MARKET_API_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        const price = response.data["Global Quote"]["05. price"];
        return parseFloat(price).toFixed(2);
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
        return null;
    }
};

// ✅ Get all holdings with live market prices
app.get("/allHoldings", async (req, res) => {
    try {
        let allHoldings = await HoldingsModel.find({});
        const updatedHoldings = await Promise.all(
            allHoldings.map(async (holding) => {
                const marketPrice = await fetchMarketPrice(holding.name);
                return {
                    ...holding.toObject(),
                    marketPrice,
                    profitLoss: ((marketPrice - holding.avg) * holding.qty).toFixed(2)
                };
            })
        );
        res.json(updatedHoldings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching holdings", error: error.message });
    }
});

// ✅ Get all positions with live market prices
app.get("/allPositions", async (req, res) => {
    try {
        let allPositions = await PositionsModel.find({});
        const updatedPositions = await Promise.all(
            allPositions.map(async (position) => {
                const marketPrice = await fetchMarketPrice(position.name);
                return {
                    ...position.toObject(),
                    marketPrice,
                    profitLoss: ((marketPrice - position.avg) * position.qty).toFixed(2)
                };
            })
        );
        res.json(updatedPositions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching positions", error: error.message });
    }
});

// ✅ Place a new order
app.post("/newOrder", async (req, res) => {
    try {
        let newOrder = new OrdersModel({
            name: req.body.name,
            qty: req.body.qty,
            price: req.body.price,
            mode: req.body.mode,
        });

        await newOrder.save();
        res.send("Order saved!");
    } catch (error) {
        res.status(500).json({ message: "Error saving order", error: error.message });
    }
});

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB connected");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
