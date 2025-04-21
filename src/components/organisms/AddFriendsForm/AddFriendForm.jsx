import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../../utils/tokenService";
import "./AddFriendForm.css"; // import the CSS
import { useNavigate } from "react-router-dom";

function AddFriendForm() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const token = getToken();

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input) {
      setError(true);
      return setMessage("Please enter an email.");
    }

    if (!isValidEmail(input)) {
      setError(true);
      return setMessage("Please enter a valid email address.");
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/friendship/add",
        { friendEmail: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Friend added!");
      setInput("");
      setError(false);
    } catch (err) {
      console.error("Add friend error:", err);
      const errorMsg =
        err.response?.data?.error || "Could not add friend. Try again.";
      setMessage(errorMsg);
      setError(true);
    }
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/chat-list");
  };

  return (
    <div className="form-container">
      <button onClick={handleGoBack}>Go back</button>
      <h2 className="form-title">Add a Friend</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`form-input ${error ? "input-error" : ""}`}
          placeholder="Enter friend's email"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
        />
        <button type="submit" className="form-button">
          Add Friend
        </button>
      </form>
      {message && (
        <p className={`form-message ${error ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AddFriendForm;
