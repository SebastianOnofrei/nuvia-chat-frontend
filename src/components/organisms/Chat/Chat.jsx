import React, { useEffect, useState, useRef } from "react";
import { connectSocket, getSocket } from "../../../utils/socket.js";
import { getToken } from "../../../utils/tokenService.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Chat.css";

const Chat = ({ activeChatRecipientId, conversationId }) => {
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const token = getToken();
  const decodedToken = jwtDecode(token);

  // Create a ref to the messages container
  const messagesEndRef = useRef(null);

  // Handle recipient change and fetch profile
  useEffect(() => {
    if (activeChatRecipientId) {
      setRecipientId(activeChatRecipientId);
      getRecipientProfile(activeChatRecipientId);
    }
  }, [activeChatRecipientId]);

  // Use effect to fetch the conversation history when the component mounts or conversationId changes
  useEffect(() => {
    console.log("Fetching conversation history...");
    getConversationHistory();
  }, [conversationId]); // Runs when conversationId changes

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    const socket = getSocket();
    const token = getToken();
    const decodedToken = jwtDecode(token);
    const senderId = decodedToken?.id;

    if (!senderId || !recipientId || !message.trim() || !conversationId) return; // Ensure we have the conversationId

    // Emit the message to the WebSocket server, including conversationId
    socket?.emit("private_message", {
      senderId,
      recipientId,
      content: message,
      conversationId, // Include conversationId here
    });

    // Also send the message to your backend to be saved in the DB
    try {
      // const response = await axios.post(
      //   `http://localhost:3000/message/send-message`, // Endpoint for saving the message
      //   {
      //     senderId,
      //     recipientId,
      //     content: message,
      //     conversationId, // Send the conversationId here
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // console.log("Message saved in DB:", response.data);

      // Update the message list to include the new message
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: decodedToken.id, content: message, timestamp: Date.now() },
      ]);

      setMessage(""); // Clear the input field after sending the message
      setIsTyping(false);
    } catch (err) {
      console.error("Error saving message:", err);
    }
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

  // Fetch conversation history
  const getConversationHistory = async () => {
    const token = getToken();
    console.log("Conversation ID:", conversationId); // Debugging conversationId

    try {
      const response = await axios.get(
        `http://localhost:3000/conversation/history`, // Endpoint for conversation history
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            conversationId: conversationId, // Send the conversationId as a query param
          },
        }
      );
      console.log("Response from server:", response.data);
      setMessages(response.data); // Set messages received from the server
    } catch (err) {
      console.error(
        "Error fetching conversation history:",
        err.response || err
      );
    }
  };

  return (
    <div className="chat-container chat-list-container__active-chat">
      {recipient.username ? (
        <>
          <h2>Chat with {recipient.username || "..."}</h2>

          {conversationId ? (
            <div className="messages">
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  key={index}
                  className={`message ${
                    msg.senderId === decodedToken.id ? "sent" : "received"
                  }`}
                >
                  <p>{msg.content}</p>
                  <small>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </small>
                </motion.div>
              ))}

              {isTyping && <p>Typing...</p>}
              {/* Scroll anchor to the bottom */}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="messages">
              You did not have a conversation with this person yet 🥲
            </div>
          )}

          <div className="chat-actions">
            <input
              type="text"
              className="message-input"
              value={message}
              onChange={(e) => {
                setIsTyping(true);
                setMessage(e.target.value);
              }}
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
