import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState("user1"); // User's unique identifier (e.g., username)
  const [message, setMessage] = useState("");
  const [privateMessage, setPrivateMessage] = useState("");
  const [recipientId, setRecipientId] = useState("user2");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to the backend server
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);
    console.log(socketInstance);

    // Register user when connected
    socketInstance.emit("register", userId);

    // Listen for private messages
    socketInstance.on("private_message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: data.senderId, message: data.message },
      ]);
    });

    // Clean up on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  // Handle sending a private message
  const sendPrivateMessage = () => {
    if (socket) {
      socket.emit("private_message", {
        senderId: userId,
        recipientId,
        message: privateMessage,
      });
      setPrivateMessage("");
    }
  };

  return (
    <div>
      <h1>Chat App</h1>

      <div>
        <h2>Send a Private Message</h2>
        <input
          type="text"
          placeholder="Recipient's ID"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
        />
        <textarea
          placeholder="Type your message..."
          value={privateMessage}
          onChange={(e) => setPrivateMessage(e.target.value)}
        />
        <button onClick={sendPrivateMessage}>Send Message</button>
      </div>

      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId}:</strong> {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
