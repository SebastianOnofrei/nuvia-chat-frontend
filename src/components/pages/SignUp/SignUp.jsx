import React, { useState } from "react";
import "./SignUp.css"; // import the CSS
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Username:", username);
    // Add your signup logic here

    try {
      const response = await axios.post("http://localhost:3000/user", {
        username,
        email,
        password,
      });

      console.log("Signup successful:", response.data);
      // You can redirect or show a success message here
      // Redirect to home page after successful signup
      navigate("/login"); // Navigate to the home page
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      // Handle error - show a message to the user
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
