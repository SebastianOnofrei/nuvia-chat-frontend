// src/components/ChatPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../utils/tokenService.js";
import { connectSocket, getSocket } from "../../../utils/socket.js";

const ChatPage = () => {
  const [friends, setFriends] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch friend list
    const fetchFriends = async () => {
      try {
        const token = getToken();
        const response = await axios.get("http://localhost:3000/user/friends", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (error) {
        console.error("Failed to fetch friends", error);
      }
    };

    fetchFriends();
    connectSocket((msg) => {
      if (msg.senderId === activeChat) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });
  }, [activeChat]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const socket = getSocket();
    socket.emit("private_message", {
      recipientId: activeChat,
      content: newMessage,
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId: "me", content: newMessage },
    ]);
    setNewMessage("");
  };

  return (
    <div>
      <h2>Friends</h2>
      <div>
        {friends.map((friend) => (
          <div key={friend._id} onClick={() => setActiveChat(friend._id)}>
            {friend.name}
          </div>
        ))}
      </div>

      {activeChat && (
        <div>
          <h3>Chat with {activeChat}</h3>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>
                  {msg.senderId === "me" ? "You" : msg.senderId}:{" "}
                </strong>
                {msg.content}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
