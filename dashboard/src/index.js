import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";
import Signup from "../landing_page/signup/Signup"; // Import Signup component

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<Home />} /> {/* Home will check auth & show Dashboard */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
