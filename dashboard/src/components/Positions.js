import React, { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {
    const [allPositions, setAllPositions] = useState([]);
    const [totalPnL, setTotalPnL] = useState(0);

    // ✅ Fetch all Positions from Backend API
    useEffect(() => {
        axios
            .get("https://stock-market-backend.onrender.com/allPositions")
            .then((res) => {
                setAllPositions(res.data);
                calculateTotal(res.data);
            })
            .catch((error) => console.error("Error fetching positions", error));
    }, []);

    // ✅ Calculate Total Profit/Loss
    const calculateTotal = (positions) => {
        let totalProfitLoss = 0;
        positions.forEach((stock) => {
            const currentValue = stock.price * stock.qty;
            const investedAmount = stock.avg * stock.qty;
            const profitLoss = currentValue - investedAmount;

            totalProfitLoss += profitLoss;
        });

        setTotalPnL(totalProfitLoss);
    };

    return (
        <>
            <h3 className="title">Positions ({allPositions.length})</h3>

            {/* ✅ Table to Show Positions */}
            <div className="order-table">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Instrument</th>
                            <th>Qty.</th>
                            <th>Avg. Cost</th>
                            <th>LTP (Live Price)</th>
                            <th>P&L</th>
                            <th>Day Chg.</th>
                        </tr>
                    </thead>

                    <tbody>
                        {allPositions.map((stock, index) => {
                            const currentValue = stock.price * stock.qty;
                            const investedAmount = stock.avg * stock.qty;
                            const profitLoss = currentValue - investedAmount;
                            const isProfit = profitLoss >= 0.0;
                            const profitClass = isProfit ? "profit" : "loss";
                            const dayClass = stock.isLoss ? "loss" : "profit";
                            const percentageChange =
                                ((profitLoss / investedAmount) * 100).toFixed(2);

                            return (
                                <tr key={index}>
                                    <td>{stock.product}</td>
                                    <td>{stock.name}</td>
                                    <td>{stock.qty}</td>
                                    <td>₹{stock.avg.toFixed(2)}</td>
                                    <td>₹{stock.price.toFixed(2)}</td>
                                    <td className={profitClass}>
                                        ₹{profitLoss.toFixed(2)} 
                                        <span> ({percentageChange}%)</span>
                                    </td>
                                    <td className={dayClass}>{stock.day}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ✅ Total P&L Section */}
            <div className="total-pnl">
                <h4>
                    Total P&L:{" "}
                    <span className={totalPnL >= 0 ? "profit" : "loss"}>
                        ₹{totalPnL.toFixed(2)}
                    </span>
                </h4>
            </div>
        </>
    );
};

export default Positions;
