require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

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

// ✅ Auto-insert default data if collections are empty
app.get("/allHoldings", async (req, res) => {
    try {
        let allHoldings = await HoldingsModel.find({});
        if (allHoldings.length === 0) {
            // Insert default holdings
            await HoldingsModel.insertMany([
                { product: "DELIVERY", name: "TCS", qty: 10, avg: 3100.5, price: 3120.75, net: "+1.2%", day: "+0.5%", isLoss: false },
                { product: "INTRADAY", name: "INFY", qty: 5, avg: 1450.5, price: 1425.75, net: "-1.7%", day: "-1.2%", isLoss: true },
                { product: "DELIVERY", name: "RELIANCE", qty: 12, avg: 2500.0, price: 2525.0, net: "+1.0%", day: "+0.8%", isLoss: false }
            ]);
            allHoldings = await HoldingsModel.find({});
        }
        res.json(allHoldings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching holdings", error: error.message });
    }
});

app.get("/allPositions", async (req, res) => {
    try {
        let allPositions = await PositionsModel.find({});
        if (allPositions.length === 0) {
            // Insert default positions
            await PositionsModel.insertMany([
                { product: "INTRADAY", name: "HDFC BANK", qty: 20, avg: 1500.0, price: 1520.0, net: "+1.3%", day: "+0.6%", isLoss: false },
                { product: "INTRADAY", name: "HCL", qty: 8, avg: 850.0, price: 840.0, net: "-1.1%", day: "-0.8%", isLoss: true },
                { product: "DELIVERY", name: "WIPRO", qty: 15, avg: 550.0, price: 555.0, net: "+0.9%", day: "+0.4%", isLoss: false }
            ]);
            allPositions = await PositionsModel.find({});
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
