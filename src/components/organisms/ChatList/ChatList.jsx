// src/components/FriendsList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../utils/tokenService.js";
import "./ChatList.css";

const ChatList = ({ setActiveChatId }) => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      const token = getToken();
      if (!token) return;

      console.log("MY TOKENNNNNNNNN");
      console.log(token);
      try {
        const response = await axios.get("http://localhost:3000/user/friends", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data);
        setActiveChatId(response.data[0]._id);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const openChat = (friendId) => {
    setActiveChatId(friendId);
  };

  return (
    <div className="chat-list">
      <h2>Conversations</h2>
      <ul>
        {friends.map((friend) => (
          <li
            key={friend._id}
            onClick={() => openChat(friend._id)}
            className="chat-list__item"
          >
            {friend.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
