require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const { HoldingsModel } = require("./models/HoldingsModel.js");
const { PositionsModel } = require("./models/PositionsModel.js");
const { OrdersModel } = require("./models/OrdersModel.js");
const authRoutes = require("./routes/authRoutes");

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;
const app = express();

// Enable CORS for frontend deployment
app.use(cors({
    origin: ["https://stock-market-web-kappa.vercel.app", "https://stock-market-webb.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(bodyParser.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Fetch Holdings from MongoDB
app.get("/allHoldings", async (req, res) => {
    try {
        // Auto Fetch Live Market Prices
        let allHoldings = await HoldingsModel.find({});

        // Fetch Real-time Prices
        const symbols = allHoldings.map(item => item.name).join(",");
        const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`);

        // Update the live market prices with response
        const marketData = response.data.quoteResponse.result;

        allHoldings = allHoldings.map((holding, index) => {
            holding.price = marketData[index]?.regularMarketPrice || holding.price;
            holding.day = marketData[index]?.regularMarketChangePercent || holding.day;
            return holding;
        });

        res.json(allHoldings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching holdings", error: error.message });
    }
});

// Fetch Positions from MongoDB
app.get("/allPositions", async (req, res) => {
    try {
        let allPositions = await PositionsModel.find({});
        
        // Fetch Live Prices
        const symbols = allPositions.map(item => item.name).join(",");
        const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`);
        
        const marketData = response.data.quoteResponse.result;
        allPositions = allPositions.map((position, index) => {
            position.price = marketData[index]?.regularMarketPrice || position.price;
            position.day = marketData[index]?.regularMarketChangePercent || position.day;
            return position;
        });

        res.json(allPositions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching positions", error: error.message });
    }
});

// Place New Order
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
        console.log(" MongoDB Connected");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

