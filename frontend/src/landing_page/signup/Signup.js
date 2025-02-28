import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
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
      const response = await fetch("http://localhost:3002/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard"); // Redirect within React app
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

  // ✅ Fake signup logic for testing
  const handleSignup = (e) => {
    e.preventDefault();
    localStorage.setItem("token", "your_fake_jwt_token");
    window.location.href = "http://localhost:3001"; // ✅ Redirect to the external dashboard project
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Signup</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={styles.input} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      <button onClick={handleSignup} style={styles.fakeSignupButton}>
        Fake Signup & Redirect
      </button>
      {message && <p style={styles.message}>{message}</p>}
      <p style={styles.loginLink}>
        Already have an account? <Link to="/login" style={styles.link}>Login</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  header: {
    marginBottom: "20px",
    fontSize: "32px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "350px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: "15px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    fontSize: "18px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s",
    marginBottom: "10px",
  },
  fakeSignupButton: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s",
    marginBottom: "15px",
  },
  message: {
    marginTop: "15px",
    fontSize: "16px",
    color: "#d9534f",
  },
  loginLink: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#333",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default Signup;
