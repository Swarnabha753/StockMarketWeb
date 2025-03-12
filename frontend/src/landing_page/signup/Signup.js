import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Signup successful! Redirecting...");
        
        setTimeout(() => {
          window.location.href = "https://stock-market-webb.vercel.app";
        }, 1000);
      } else {
        setMessage(data.message || "Signup failed!");
      }
    } catch (error) {
      setMessage("Error signing up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.header}>Create an Account</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={styles.input} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        <p style={styles.loginLink}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
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
    background: "linear-gradient(135deg, rgba(247, 247, 247, 0.9), rgba(198, 198, 198, 0.9)), url('https://source.unsplash.com/1600x900/?technology')",
    backgroundSize: "cover",
    backdropFilter: "blur(10px)",
  },
  container: {
    width: "400px",
    padding: "30px",
    borderRadius: "12px",
    background: "rgba(209, 202, 202, 0.95)",
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
    background: "rgba(255,255,255,0.7)",
    color: "#000",
    outline: "none",
    transition: "0.3s ease",
  },
  inputFocus: {
    background: "rgba(255,255,255,0.8)",
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
    color: "#000",
  },
  loginLink: {
    marginTop: "15px",
    fontSize: "16px",
    color: "#000",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default Signup;


