import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../utils/tokenService";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const token = getToken();
  const decodedToken = jwtDecode(token);

  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        `http://localhost:3000/user/${decodedToken.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
    };
    console.log(user);
    fetchUser();
  }, []);

  const handleOnSettings = () => {
    navigate("/user-profile");
  };

  const handleAddFriend = () => {
    navigate("/add-friend");
  };

  return (
    <aside>
      <div className="actions-container">
        <button onClick={handleAddFriend}>Add contact</button>
        <button onClick={handleOnSettings}>Settings</button>
        <div className="space"></div>
        <div className="user-details">
          <img src={user.profilePicture} alt="avatar" className="user-avatar" />
          <div>
            <h5>{user.username}</h5>
            <h6>{user.email}</h6>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
