import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {
    const [allHoldings, setAllHoldings] = useState([]);
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [currentValue, setCurrentValue] = useState(0);
    const [totalPnL, setTotalPnL] = useState(0);

    // ✅ Automatically fetch live market prices from backend API
    useEffect(() => {
        axios
            .get("https://stock-market-backend.onrender.com/allHoldings")
            .then((res) => {
                setAllHoldings(res.data);
                calculateTotal(res.data);
            })
            .catch((error) => console.error("Error fetching holdings", error));
    }, []);

    // ✅ Calculate Total Investment, Current Value, and Total P&L
    const calculateTotal = (holdings) => {
        let totalInvest = 0;
        let currentVal = 0;
        let pnl = 0;

        holdings.forEach((stock) => {
            const invested = stock.qty * stock.avg;
            const curValue = stock.qty * stock.price;
            const profitLoss = curValue - invested;

            totalInvest += invested;
            currentVal += curValue;
            pnl += profitLoss;
        });

        setTotalInvestment(totalInvest);
        setCurrentValue(currentVal);
        setTotalPnL(pnl);
    };

    // ✅ Setup Data for Chart Graph
    const labels = allHoldings.map((subArray) => subArray["name"]);
    const data = {
        labels,
        datasets: [
            {
                label: "Stock Price",
                data: allHoldings.map((stock) => stock.price),
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };

    return (
        <>
            <h3 className="title">Holdings ({allHoldings.length})</h3>

            {/* ✅ Holdings Table */}
            <div className="order-table">
                <table>
                    <thead>
                        <tr>
                            <th>Instrument</th>
                            <th>Qty.</th>
                            <th>Avg. cost</th>
                            <th>LTP</th>
                            <th>Cur. val</th>
                            <th>P&L</th>
                            <th>Net chg.</th>
                            <th>Day chg.</th>
                        </tr>
                    </thead>

                    <tbody>
                        {allHoldings.map((stock, index) => {
                            const curValue = stock.price * stock.qty;
                            const profitLoss = curValue - stock.avg * stock.qty;
                            const isProfit = profitLoss >= 0.0;
                            const profClass = isProfit ? "profit" : "loss";
                            const dayClass = stock.isLoss ? "loss" : "profit";

                            return (
                                <tr key={index}>
                                    <td>{stock.name}</td>
                                    <td>{stock.qty}</td>
                                    <td>{stock.avg.toFixed(2)}</td>
                                    <td>{stock.price.toFixed(2)}</td>
                                    <td>{curValue.toFixed(2)}</td>
                                    <td className={profClass}>
                                        {profitLoss.toFixed(2)}
                                    </td>
                                    <td className={profClass}>{stock.net}</td>
                                    <td className={dayClass}>{stock.day}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ✅ P&L Summary */}
            <div className="row">
                <div className="col">
                    <h5>
                        ₹{totalInvestment.toFixed(2)}
                    </h5>
                    <p>Total Investment</p>
                </div>
                <div className="col">
                    <h5>
                        ₹{currentValue.toFixed(2)}
                    </h5>
                    <p>Current Value</p>
                </div>
                <div className="col">
                    <h5 className={totalPnL >= 0 ? "profit" : "loss"}>
                        ₹{totalPnL.toFixed(2)} (
                        {((totalPnL / totalInvestment) * 100).toFixed(2)}%)
                    </h5>
                    <p>Total P&L</p>
                </div>
            </div>

            {/* ✅ Vertical Chart */}
            <VerticalGraph data={data} />
        </>
    );
};

export default Holdings;
