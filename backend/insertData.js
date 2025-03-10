require("dotenv").config();
const mongoose = require("mongoose");
const { HoldingsModel } = require("./models/HoldingsModel.js");
const { PositionsModel } = require("./models/PositionsModel.js");

const url = process.env.MONGO_URL;

// ✅ Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));

// ✅ Insert Holdings Data
const holdingsData = [
    {
        product: "EQ",
        name: "TCS",
        qty: 5,
        avg: 3524.75,
        price: 3602.65,
        net: "+12.04%",
        day: "+2.35%",
        isLoss: false,
    },
    {
        product: "EQ",
        name: "Reliance",
        qty: 10,
        avg: 2724.80,
        price: 2682.90,
        net: "-5.02%",
        day: "-1.02%",
        isLoss: true,
    },
    {
        product: "EQ",
        name: "HDFC Bank",
        qty: 12,
        avg: 1564.40,
        price: 1592.20,
        net: "+3.21%",
        day: "+1.02%",
        isLoss: false,
    },
    {
        product: "EQ",
        name: "Infosys",
        qty: 8,
        avg: 1324.50,
        price: 1302.10,
        net: "-1.69%",
        day: "-0.80%",
        isLoss: true,
    },
    {
        product: "EQ",
        name: "Wipro",
        qty: 15,
        avg: 524.30,
        price: 532.70,
        net: "+1.60%",
        day: "+0.82%",
        isLoss: false,
    },
    {
        product: "EQ",
        name: "ITC",
        qty: 30,
        avg: 324.50,
        price: 328.10,
        net: "+1.12%",
        day: "+0.20%",
        isLoss: false,
    },
    {
        product: "EQ",
        name: "Bajaj Finance",
        qty: 6,
        avg: 7024.40,
        price: 6920.30,
        net: "-2.00%",
        day: "-0.85%",
        isLoss: true,
    }
];

// ✅ Insert Positions Data
const positionsData = [
    {
        product: "MIS",
        name: "Tata Steel",
        qty: 4,
        avg: 123.50,
        price: 128.40,
        net: "+4.56%",
        day: "+1.12%",
        isLoss: false,
    },
    {
        product: "MIS",
        name: "ONGC",
        qty: 10,
        avg: 172.10,
        price: 165.80,
        net: "-3.66%",
        day: "-1.21%",
        isLoss: true,
    },
    {
        product: "MIS",
        name: "SBI Bank",
        qty: 5,
        avg: 592.20,
        price: 600.10,
        net: "+1.34%",
        day: "+0.58%",
        isLoss: false,
    },
    {
        product: "MIS",
        name: "Coal India",
        qty: 20,
        avg: 224.40,
        price: 220.50,
        net: "-1.72%",
        day: "-0.70%",
        isLoss: true,
    },
    {
        product: "MIS",
        name: "Adani Ports",
        qty: 3,
        avg: 924.30,
        price: 912.40,
        net: "-1.28%",
        day: "-0.89%",
        isLoss: true,
    },
    {
        product: "MIS",
        name: "Hindustan Unilever",
        qty: 2,
        avg: 2524.80,
        price: 2602.30,
        net: "+3.05%",
        day: "+1.03%",
        isLoss: false,
    }
];

// ✅ Function to insert data
const insertData = async () => {
    try {
        // ✅ Insert Holdings
        await HoldingsModel.insertMany(holdingsData);
        console.log("✅ Holdings inserted successfully!");

        // ✅ Insert Positions
        await PositionsModel.insertMany(positionsData);
        console.log("✅ Positions inserted successfully!");

        // ✅ Close DB
        mongoose.connection.close();
    } catch (error) {
        console.log("❌ Error inserting data:", error);
    }
};

// ✅ Run the function
insertData();
