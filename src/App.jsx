import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./utils/tokenService.js"; // Utility to get the JWT token
import Home from "./components/pages/Home/Home.jsx";
import SignUp from "./components/pages/SignUp/SignUp.jsx";
import Login from "./components/pages/Login/Login.jsx";

import ChatPage from "./components/pages/ChatPage/ChatPage.jsx";
import UserProfile from "./components/pages/UserProfile/UserProfile.jsx";
import AddFriendForm from "./components/organisms/AddFriendsForm/AddFriendForm.jsx";

// Private Route Wrapper to protect routes that require authentication
const PrivateRoute = ({ element }) => {
  const token = getToken();
  if (!token) {
    // Redirect to Login if there's no valid token
    return <Navigate to="/login" />;
  }
  return element;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* Private routes */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route
          path="/chat-list"
          element={<PrivateRoute element={<ChatPage />} />}
        />
        <Route
          path="/add-friend"
          element={<PrivateRoute element={<AddFriendForm />} />}
        />
        <Route
          path="/user-profile"
          element={<PrivateRoute element={<UserProfile />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
