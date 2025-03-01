import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Login successful! Redirecting...");

        setTimeout(() => {
          window.location.href = "http://localhost:3001";
        }, 1000);
      } else {
        setMessage(data.message || "Login failed!");
      }
    } catch (error) {
      setMessage("Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.header}>Welcome Back</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        <p style={styles.signupLink}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
    background: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(135deg, rgba(2, 14, 23, 0.9), rgba(194, 158, 87, 0.95)), url('https://source.unsplash.com/1600x900/?technology')",
      backgroundSize: "cover",
      backdropFilter: "blur(10px)",
    },
    container: {
      width: "400px",
      padding: "30px",
      borderRadius: "12px",
      background: "rgba(255, 255, 255, 0.15)",
      backdropFilter: "blur(12px)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      textAlign: "center",
      animation: "fadeIn 1s ease-in-out",
    },
    header: {
      color: "#ffffff",
      fontSize: "28px",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    input: {
      marginBottom: "12px",
      padding: "12px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "none",
      background: "rgba(255,255,255,0.2)",
      color: "#fff",
      outline: "none",
      transition: "0.3s ease",
    },
    inputFocus: {
      background: "rgba(255,255,255,0.3)",
    },
    button: {
      padding: "12px",
      fontSize: "18px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#007bff",
      color: "#fff",
      cursor: "pointer",
      transition: "0.3s",
    },
    buttonHover: {
      backgroundColor: "#003451",
    },
    message: {
      marginTop: "15px",
      fontSize: "16px",
      color: "#ffcc00",
    },
    signupLink: {
        marginTop: "15px",
        fontSize: "16px",
        color: "#fff",
    },
    link: {
      color: "#ffcc00",
      textDecoration: "none",
    },
  };
export default Login;

