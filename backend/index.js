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

const app = express();

app.use(cors({
    origin: ["https://stock-market-web-kappa.vercel.app", "https://stock-market-webb.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

// Fetch Live Market Prices from Yahoo Finance API
const fetchLivePrice = async (symbol) => {
    try {
        const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`);
        return response.data.quoteResponse.result[0].regularMarketPrice;
    } catch (error) {
        console.error("Failed to fetch market price", error);
        return null;
    }
};

app.get("/allHoldings", async (req, res) => {
    try {
        let allHoldings = await HoldingsModel.find({});
        
        // Fetch live prices and update the holdings
        for (let i = 0; i < allHoldings.length; i++) {
            const livePrice = await fetchLivePrice(allHoldings[i].name);
            if (livePrice !== null) {
                allHoldings[i].price = livePrice;
                await allHoldings[i].save();
            }
        }

        res.json(allHoldings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching holdings", error: error.message });
    }
});

app.get("/allPositions", async (req, res) => {
    try {
        let allPositions = await PositionsModel.find({});

        // Fetch live prices and update the positions
        for (let i = 0; i < allPositions.length; i++) {
            const livePrice = await fetchLivePrice(allPositions[i].name);
            if (livePrice !== null) {
                allPositions[i].price = livePrice;
                await allPositions[i].save();
            }
        }

        res.json(allPositions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching positions", error: error.message });
    }
});

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

// Connect to MongoDB and start the server
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
