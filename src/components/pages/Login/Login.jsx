// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { setToken } from "../../../utils/tokenService";
import { connectSocket } from "../../../utils/socket"; // 🔥 Import this

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);

      setToken(response.data.token); // ✅ Store JWT
      connectSocket(); // 🔥 Connect to socket after storing token

      navigate("/chat-list"); // Redirect to chat list
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
          <small>or</small>
          <button className="signup-btn" onClick={handleSignup}>
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
