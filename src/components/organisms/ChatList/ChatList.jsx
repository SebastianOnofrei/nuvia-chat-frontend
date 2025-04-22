// src/components/FriendsList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../utils/tokenService.js";
import { jwtDecode } from "jwt-decode";
import { calculateTime } from "../../../utils/timeCalculation.js";
import "./ChatList.css";

const ChatList = ({ setActiveChatId, setConversationId }) => {
  const [friends, setFriends] = useState([]);
  const token = getToken();
  const decodedToken = jwtDecode(token);
  const senderId = decodedToken?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:3000/user/friends", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const friendsData = response.data;

        const friendsWithLastMessage = await Promise.all(
          friendsData.map(async (friend) => {
            try {
              const res = await axios.get(
                `http://localhost:3000/conversation/${senderId}/${friend._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              return {
                ...friend,
                lastMessage: res.data.lastMessage || {}, // fallback if no message
                conversationId: res.data._id,
              };
            } catch (error) {
              console.error(
                "Error fetching last message for",
                friend._id,
                error
              );
              return {
                ...friend,
                lastMessage: {}, // fallback in case of error
              };
            }
          })
        );

        setFriends(friendsWithLastMessage);
        if (friendsWithLastMessage.length > 0) {
          setActiveChatId(friendsWithLastMessage[0]._id);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const openChat = (friendId, conversationId) => {
    setActiveChatId(friendId);
    setConversationId(conversationId);
  };

  console.log(friends);

  return (
    <div className="chat-list">
      <h2>Conversations</h2>

      <ul>
        {friends.map((friend) => (
          <li
            key={friend._id}
            onClick={() => openChat(friend._id, friend.conversationId)}
            className="chat-list__item"
          >
            <img
              src={friend.profilePicture}
              alt="friend-avatar"
              className="user-avatar"
            />
            <div className="chat-list__item-details">
              <div>
                <span>{friend.username}</span>
                <p>{friend.lastMessage?.content ?? "No message yet"}</p>
              </div>

              <small>
                {friend.lastMessage?.timestamp
                  ? calculateTime(friend.lastMessage.timestamp)
                  : ""}
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
