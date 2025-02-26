import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/signup"); // Redirect if not authenticated
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (isAuthenticated === null) {
    return <p>Checking authentication...</p>; // Show a better loading message
  }

  <>
      <TopBar /> {/* Include the topbar */}
      {isAuthenticated ? <Dashboard /> : null}
    </>
};

export default Home;
