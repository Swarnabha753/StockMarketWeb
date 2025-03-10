// import React, { useState, useEffect } from "react";
// import axios, { all } from "axios";
// import { VerticalGraph } from "./VerticalGraph";
// 
// // import { holdings } from "../data/data";
// 
// const Holdings = () => {
//     const [allHoldings, setAllHoldings] = useState([]);
// 
//     useEffect(() => {
//         axios.get("http://localhost:3002/allHoldings").then((res) => {
//             // console.log(res.data);
//             setAllHoldings(res.data);
//         });
//     }, []);
// 
//     // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
//     const labels = allHoldings.map((subArray) => subArray["name"]);
// 
//     const data = {
//         labels,
//         datasets: [
//             {
//                 label: "Stock Price",
//                 data: allHoldings.map((stock) => stock.price),
//                 backgroundColor: "rgba(255, 99, 132, 0.5)",
//             },
//         ],
//     };
// 
//     // export const data = {
//     //   labels,
//     //   datasets: [
//     // {
//     //   label: 'Dataset 1',
//     //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//     //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     // },
//     //     {
//     //       label: 'Dataset 2',
//     //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//     //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     //     },
//     //   ],
//     // };
// 
//     return (
//         <>
//             <h3 className="title">Holdings ({allHoldings.length})</h3>
// 
//             <div className="order-table">
//                 <table>
//                     <tr>
//                         <th>Instrument</th>
//                         <th>Qty.</th>
//                         <th>Avg. cost</th>
//                         <th>LTP</th>
//                         <th>Cur. val</th>
//                         <th>P&L</th>
//                         <th>Net chg.</th>
//                         <th>Day chg.</th>
//                     </tr>
// 
//                     {allHoldings.map((stock, index) => {
//                         const curValue = stock.price * stock.qty;
//                         const isProfit = curValue - stock.avg * stock.qty >= 0.0;
//                         const profClass = isProfit ? "profit" : "loss";
//                         const dayClass = stock.isLoss ? "loss" : "profit";
// 
//                         return (
//                             <tr key={index}>
//                                 <td>{stock.name}</td>
//                                 <td>{stock.qty}</td>
//                                 <td>{stock.avg.toFixed(2)}</td>
//                                 <td>{stock.price.toFixed(2)}</td>
//                                 <td>{curValue.toFixed(2)}</td>
//                                 <td className={profClass}>
//                                     {(curValue - stock.avg * stock.qty).toFixed(2)}
//                                 </td>
//                                 <td className={profClass}>{stock.net}</td>
//                                 <td className={dayClass}>{stock.day}</td>
//                             </tr>
//                         );
//                     })}
//                 </table>
//             </div>
// 
//             <div className="row">
//                 <div className="col">
//                     <h5>
//                         29,875.<span>55</span>{" "}
//                     </h5>
//                     <p>Total investment</p>
//                 </div>
//                 <div className="col">
//                     <h5>
//                         31,428.<span>95</span>{" "}
//                     </h5>
//                     <p>Current value</p>
//                 </div>
//                 <div className="col">
//                     <h5>1,553.40 (+5.20%)</h5>
//                     <p>P&L</p>
//                 </div>
//             </div>
//             <VerticalGraph data={data} />
//         </>
//     );
// };
// 
// export default Holdings;
// ✅ Step 1: Install Chart.js in your Dashboard folder
// Run this in your dashboard folder terminal
// npm install chart.js react-chartjs-2

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/allHoldings`);
        let totalInvest = 0;
        let totalProfit = 0;

        const updatedHoldings = await Promise.all(
          response.data.map(async (holding) => {
            const stockResponse = await axios.get(
              `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${holding.name}`
            );
            const livePrice = stockResponse.data.quoteResponse.result[0].regularMarketPrice;
            const profitLoss = (((livePrice - holding.avg) / holding.avg) * 100).toFixed(2);

            totalInvest += holding.qty * holding.avg;
            totalProfit += (livePrice - holding.avg) * holding.qty;

            return {
              ...holding,
              livePrice,
              profitLoss,
            };
          })
        );
        setHoldings(updatedHoldings);
        setTotalInvestment(totalInvest);
        setTotalProfitLoss(totalProfit);
        updateChart(updatedHoldings);
      } catch (error) {
        console.error('Failed to fetch data');
      }
    };

    fetchHoldings();
    const interval = setInterval(fetchHoldings, 5000); // ✅ Auto refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const updateChart = (holdings) => {
    if (!holdings || holdings.length === 0) return;

    setChartData({
      labels: holdings.map(h => h.name),
      datasets: [
        {
          label: 'Profit/Loss (%)',
          data: holdings.map(h => h.profitLoss),
          backgroundColor: holdings.map(h => h.profitLoss >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'),
          borderColor: holdings.map(h => h.profitLoss >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    const autoLogout = setTimeout(() => {
      localStorage.removeItem('token');
      window.location.href = 'https://stock-market-web-kappa.vercel.app/login';
    }, 1800000); // ✅ Auto logout after 30 minutes

    return () => clearTimeout(autoLogout);
  }, []);

  if (!chartData) {
    return <h3>Loading Chart Data...</h3>; // ✅ Prevent crashing when data is undefined
  }

  return (
    <div>
      <h2>Your Holdings</h2>
      <h3>Total Investment: ₹{totalInvestment.toFixed(2)}</h3>
      <h3>Total Profit/Loss: ₹{totalProfitLoss.toFixed(2)}</h3>
      <Line data={chartData} />
      <table>
        <thead>
          <tr>
            <th>Stock Name</th>
            <th>Average Price</th>
            <th>Live Price</th>
            <th>Profit/Loss (%)</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => (
            <tr key={index}>
              <td>{holding.name}</td>
              <td>₹{holding.avg}</td>
              <td>₹{holding.livePrice}</td>
              <td style={{ color: holding.profitLoss >= 0 ? 'green' : 'red' }}>
                {holding.profitLoss}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Holdings;
