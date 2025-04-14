import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/pages/SignUp/SignUp.jsx";
import Login from "./components/pages/Login/Login.jsx";
import Chat from "./components/pages/Chat/Chat.jsx";
import Home from "./components/pages/Home/Home.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* trebuie sa verific daca am un token activ.. trebuie sa vad ce sa intampla cu jwt acesta cand il dam. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
