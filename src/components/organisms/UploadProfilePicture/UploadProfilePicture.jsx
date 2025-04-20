import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../utils/tokenService";
import "./UploadProfilePicture.css"; // import the CSS

function UploadProfilePicture() {
  const navigate = useNavigate();
  const token = getToken();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setError(false); // Reset error when file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError(true);
      return setMessage("Please select an image to upload.");
    }

    const formData = new FormData();
    formData.append("image", file);

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
      setMessage("Upload failed. Please try again.");
      setError(true);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Upload Profile Picture</h2>
      <form onSubmit={handleSubmit} className="form-content">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className={`file-input ${error ? "input-error" : ""}`}
        />
        <button type="submit" className="form-button">
          Upload
        </button>
      </form>
      {message && (
        <p className={`form-message ${error ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default UploadProfilePicture;
