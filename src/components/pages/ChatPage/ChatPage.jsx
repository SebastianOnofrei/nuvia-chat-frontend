// src/components/ChatPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../utils/tokenService.js";
import { connectSocket, getSocket } from "../../../utils/socket.js";
import FriendsList from "../../organisms/FriendsList/FriendsList.jsx";

const ChatPage = () => {
  return (
    <div>
      <h2>Friends</h2>
      <FriendsList />
    </div>
  );
};

export default ChatPage;
