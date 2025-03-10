require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./models/HoldingsModel.js");
const { PositionsModel } = require("./models/PositionsModel.js");
const { OrdersModel } = require("./models/OrdersModel");

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;

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

app.get("/allHoldings", async (req, res) => {
    try {
        let allHoldings = await HoldingsModel.find({});
        res.json(allHoldings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching holdings", error: error.message });
    }
});

app.get("/allPositions", async (req, res) => {
    try {
        let allPositions = await PositionsModel.find({});
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
