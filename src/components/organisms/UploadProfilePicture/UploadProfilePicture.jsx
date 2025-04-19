import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../utils/tokenService";

function UploadProfilePicture() {
  const navigate = useNavigate();
  const token = getToken();
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("image", file); // 'image' should match the multer field name

    try {
      const res = await axios.post(
        "http://localhost:3000/user/update-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/chat-list");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadProfilePicture;
