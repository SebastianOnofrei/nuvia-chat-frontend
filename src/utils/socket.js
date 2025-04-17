// utils/socket.js

import { io } from "socket.io-client";
import { getToken } from "./tokenService.js";

let socket;

export const connectSocket = (onMessageReceived) => {
  const token = getToken();
  console.log("Token:", token); // Check if token is valid

  if (!token) {
    console.warn("No token found. Cannot connect to socket.");
    return;
  }

  // If already connected, do nothing
  if (socket && socket.connected) return;

  socket = io("http://localhost:3000", {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("welcome", (msg) => {
    console.log("👋 Welcome:", msg);
  });

  socket.on("private_message", ({ senderId, content, timestamp }) => {
    console.log("📨 New message:", { senderId, content, timestamp });
    if (typeof onMessageReceived === "function") {
      onMessageReceived({ senderId, content, timestamp });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });
};

export const getSocket = () => socket;
