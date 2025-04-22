// src/components/ChatPage.jsx
import React, { useState, useEffect } from "react";
import ChatList from "../../organisms/ChatList/ChatList.jsx";
import "./ChatPage.css";
import Sidebar from "../../organisms/Sidebar/Sidebar.jsx";
import Chat from "../../organisms/Chat/Chat.jsx";

const ChatPage = () => {
  // functie care seteaza chatul activ.
  const [activeChatId, setActiveChatId] = useState("");
  const [conversationId, setConversationId] = useState("");

  useEffect(() => {
    console.log("============ SA SCHIMBAT ACTIVE CHAT ID? ");
    console.log(activeChatId);
    console.log("============ SA SCHIMBAT CONVERSATION ID? ");
    console.log(conversationId);
  }, [activeChatId, conversationId]);

  return (
    <div className="chat-list-container">
      <Sidebar />
      <ChatList
        setActiveChatId={setActiveChatId}
        setConversationId={setConversationId}
      />

      <Chat
        className="chat-list-container__active-chat"
        activeChatRecipientId={activeChatId}
        conversationId={conversationId}
      />
    </div>
  );
};

export default ChatPage;
