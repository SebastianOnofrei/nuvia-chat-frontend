import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Home.css";
import FriendsList from "../../organisms/FriendsList/FriendsList";

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUpClick = () => {
    navigate("/signup"); // Navigate to the signup page
  };

  const handleLoginClick = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="home-container">
      <div className="home-box">
        <h2>Welcome to Nuvia Chat</h2>
        <p>Choose an option to get started:</p>

        <div className="button-group">
          <button onClick={handleSignUpClick}>Sign Up</button>
          <button onClick={handleLoginClick}>Log In</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
