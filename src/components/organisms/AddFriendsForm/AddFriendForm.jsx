import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../../utils/tokenService";

function AddFriendForm() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const token = getToken();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input) return setMessage("Please enter an email or phone number.");

    try {
      const res = await axios.post(
        "http://localhost:3000/friendship/add",
        { identifier: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Friend added!");
      setInput("");
    } catch (err) {
      console.error("Add friend error:", err);
      const errorMsg =
        err.response?.data?.error || "Could not add friend. Try again.";
      setMessage(errorMsg);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Add a Friend</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter email or phone number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <button type="submit" style={{ padding: 10, width: "100%" }}>
          Add Friend
        </button>
      </form>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}

export default AddFriendForm;
