import React from "react";
import UploadProfilePicture from "../../organisms/UploadProfilePicture/UploadProfilePicture";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/chat-list");
  };

  return (
    <div>
      <button onClick={handleGoBack}>Go back</button>
      <UploadProfilePicture />
    </div>
  );
};

export default UserProfile;
