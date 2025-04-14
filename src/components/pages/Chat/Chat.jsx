// src/components/ChatComponent.jsx

import React, { useEffect, useState } from "react";
import { connectSocket, getSocket } from "../../../utils/socket.js";
import { getToken } from "../../../utils/tokenService.js";

const ChatComponent = ({ recipientId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to the socket when the component is mounted
    connectSocket();

    const socket = getSocket();

    socket?.on("private_message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: data.senderId,
          content: data.message,
          timestamp: data.timestamp,
        },
      ]);
    });

    // Clean up socket when component is unmounted
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const socket = getSocket();
    const token = getToken();

    if (!message.trim()) return; // Don't send empty messages

    socket?.emit("private_message", {
      senderId: token, // Use the user ID or token from JWT
      recipientId,
      message,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId: "You", content: message, timestamp: Date.now() },
    ]);

    setMessage(""); // Clear the input after sending
  };

  return (
    <div>
      <div>
        <h2>Chat with {recipientId}</h2>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <p>
                <strong>{msg.senderId}:</strong> {msg.content}
              </p>
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
