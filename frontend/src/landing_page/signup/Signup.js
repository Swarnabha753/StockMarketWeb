import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:3002/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Signup successful! Redirecting...");
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          window.location.href = "/dashboard"; // Redirect to dashboard
        }, 1500);
      } else {
        setMessage(data.message || "Signup failed!");
      }
    } catch (error) {
      setMessage("Error signing up!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Signup</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={styles.input} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
        <button type="submit" style={styles.button}>Signup</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <p style={styles.loginLink}>
        Already have an account? <Link to="/login" style={styles.link}>Login</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  header: {
    marginBottom: '20px',
    fontSize: '32px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '350px',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: '20px',
    padding: '15px',
    fontSize: '18px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '15px',
    fontSize: '18px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#d9534f',
  },
  loginLink: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#333',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Signup;