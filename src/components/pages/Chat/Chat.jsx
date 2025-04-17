// src/components/ChatComponent.jsx

import React, { useEffect, useState } from "react";
import { connectSocket, getSocket } from "../../../utils/socket.js";
import { getToken } from "../../../utils/tokenService.js";
import { jwtDecode } from "jwt-decode"; // Import the jwt-decode library
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Chat.css";

const Chat = () => {
  const { recipientId } = useParams(); // ✅ magic happens here
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    // Connect to the socket when the component is mounted
    getRecipientProfile();

    connectSocket((msg) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: msg.senderId,
          content: msg.content,
          timestamp: msg.timestamp,
        },
      ]);
    });

    const socket = getSocket();

    // Clean up socket when component is unmounted
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const socket = getSocket();
    const token = getToken();
    const decodedToken = jwtDecode(token);
    const senderId = decodedToken?.id;

    console.log("SEND MESSAGE....");
    console.log(senderId);
    console.log(recipientId);
    console.log(message);

    if (!senderId || !recipientId || !message.trim()) return;

    console.log("Emitting private_message:", {
      senderId,
      recipientId,
      content: message,
    });

    socket?.emit("private_message", {
      senderId,
      recipientId,
      content: message,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId: "You", content: message, timestamp: Date.now() },
    ]);

    setMessage(""); // Clear the input after sending
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission (if inside form)
      sendMessage(); // Trigger message send
    }
  };

  const getRecipientProfile = async () => {
    // /user/:recipiendId. asta trebe
    const token = getToken();
    const response = await axios.get(
      `http://localhost:3000/user/${recipientId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    setRecipient(response.data);
  };

  const handleGoBack = () => {
    navigate("/chat-list");
  };

  return (
    <div className="chat-container">
      <button onClick={handleGoBack}>BACK TO CHATLIST</button>

      <div>
        <h2>Chat with {recipient.username}</h2>
        <div className="chat-box">
          <div className="messages">
            {messages.map((msg, index) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                key={index}
                className={`message ${
                  msg.senderId === "You" ? "sent" : "received"
                }`}
              >
                <p>
                  <strong>
                    {msg.senderId !== "You" ? recipient.username : msg.senderId}
                    :
                  </strong>{" "}
                  {msg.content}
                </p>
                <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <input
        type="text"
        className="message-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} className="send-btn">
        Send
      </button>
    </div>
  );
};

export default Chat;
