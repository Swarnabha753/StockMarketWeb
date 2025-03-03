import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
    const [selectedMenu, setSelectedMenu] = useState(0);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleMenuClick = (index) => {
        setSelectedMenu(index);
    };

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    // ✅ Logout function
    const handleLogout = () => {
    localStorage.removeItem("token"); // Clear user session
    setTimeout(() => {
        window.location.href = "http://localhost:3000"; // Redirect to Landing Page
    }, 1000); 
};


    return (
        <div className="menu-container">
            <img src="logo.png" style={{ width: "50px" }} />
            <div className="menus">
                <ul>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/" onClick={() => handleMenuClick(0)}>
                            <p className={selectedMenu === 0 ? "menu selected" : "menu"}>Dashboard</p>
                        </Link>
                    </li>
                    <li>
                        <Link   style={{ textDecoration: "none" }} to="/orders" onClick={() => handleMenuClick(1)}>
                            <p className={selectedMenu === 1 ? "menu selected" : "menu"}>Orders</p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/holdings" onClick={() => handleMenuClick(2)}>
                            <p className={selectedMenu === 2 ? "menu selected" : "menu"}>Holdings</p>
                        </Link>
                    </li>
                    <li>
                        <Link  style={{ textDecoration: "none" }} to="/positions" onClick={() => handleMenuClick(3)}>
                            <p className={selectedMenu === 3 ? "menu selected" : "menu"}>Positions</p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/funds" onClick={() => handleMenuClick(4)}>
                            <p className={selectedMenu === 4 ? "menu selected" : "menu"}>Funds</p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/apps" onClick={() => handleMenuClick(6)}>
                            <p className={selectedMenu === 6 ? "menu selected" : "menu"}>Apps</p>
                        </Link>
                    </li>
                </ul>
                <hr />

                {/* Profile Section */}
                <div className="profile" onClick={handleProfileClick}>
                    <div className="avatar">ZU</div>
                    <p className="username">USERID</p>
                </div>

                {/* Dropdown for Logout */}
                {isProfileDropdownOpen && (
    <div style={{
        position: "absolute",
        top: "50px",
        right: "10px",
        background: "rgba(255, 255, 255, 0.9)", // Glassmorphism effect
        backdropFilter: "blur(10px)", // Blurred background
        padding: "10px 20px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: "1000"
    }}>
        <button 
            onClick={handleLogout} 
            style={{
                background: "linear-gradient(135deg,rgb(22, 79, 140), #0056b3)", // Gradient blue
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "0.3s"
                // boxShadow: "0px 4px 10px rgba(0, 123, 255, 0.3)"
            }}
            onMouseOver={(e) => e.target.style.background = "#0056b3"} 
            onMouseOut={(e) => e.target.style.background = "linear-gradient(135deg, #007bff, #0056b3)"}
        >
            Logout
        </button>
    </div>
)}

            </div>
        </div>
    );
};



export default Menu;


