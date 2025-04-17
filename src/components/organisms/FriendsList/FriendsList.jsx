// src/components/FriendsList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../utils/tokenService.js";

const FriendsList = () => {
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
        console.log("============================= FRIENDS? ");
        console.log(friends);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [friends]);

  const openChat = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  return (
    <div>
      <h2>Your Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend._id} onClick={() => openChat(friend._id)}>
            {friend.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
