import React, { useEffect, useState, useRef } from "react";
import { connectSocket, getSocket } from "../../../utils/socket.js";
import { getToken } from "../../../utils/tokenService.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Chat.css";

const Chat = ({ activeChatRecipientId }) => {
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState({});
  const navigate = useNavigate();

  // Create a ref to the messages container
  const messagesEndRef = useRef(null);

  // Handle recipient change and fetch profile
  useEffect(() => {
    if (activeChatRecipientId) {
      setRecipientId(activeChatRecipientId);
      getRecipientProfile(activeChatRecipientId);
    }
  }, [activeChatRecipientId]);

  // Set up socket connection and listener
  useEffect(() => {
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
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Scroll to the bottom when messages change
  useEffect(() => {
    // Scroll to the bottom of the messages container
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // This will run every time messages change

  const sendMessage = () => {
    const socket = getSocket();
    const token = getToken();
    const decodedToken = jwtDecode(token);
    const senderId = decodedToken?.id;

    if (!senderId || !recipientId || !message.trim()) return;

    socket?.emit("private_message", {
      senderId,
      recipientId,
      content: message,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId: "You", content: message, timestamp: Date.now() },
    ]);

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const getRecipientProfile = async (id) => {
    const token = getToken();
    try {
      const response = await axios.get(`http://localhost:3000/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecipient(response.data);
    } catch (err) {
      console.error("Error fetching recipient profile:", err);
    }
  };

  return (
    <div className="chat-container chat-list-container__active-chat">
      {recipient.username ? (
        <>
          <h2>Chat with {recipient.username || "..."}</h2>

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
                  {/* {msg.senderId !== "You" ? recipient.username : msg.senderId}: */}
                  {msg.content}
                </p>
                <small>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </small>
              </motion.div>
            ))}
            {/* Scroll anchor to the bottom */}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-actions">
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
        </>
      ) : (
        <h1>You have no active chats!</h1>
      )}
    </div>
  );
};

export default Chat;
