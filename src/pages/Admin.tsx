import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar.tsx";
import NewGame from "./NewGame.tsx";
import ControlPanel from "./ControlPanel.tsx";
import AddPoints from "./AddPoints.tsx";
import GameHistory from "./GameHistory.tsx";
import Draw from "./Draw.tsx";

// Simple hardcoded credentials (for demo only)
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Persist login state
    const logged = localStorage.getItem("admin_logged_in");
    if (logged === "true") setIsLoggedIn(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      localStorage.setItem("admin_logged_in", "true");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_logged_in");
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded shadow-md w-80"
        >
          <h2 className="text-2xl mb-6 text-center font-bold">Admin Login</h2>
          <input
            className="w-full mb-4 p-2 border rounded"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            className="w-full mb-4 p-2 border rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <Navbar>
        <button
          className="ml-auto mr-2 px-4 py-2 text-sm font-bold text-red-600 hover:text-white hover:bg-red-600 rounded transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </Navbar>
      <Routes>
        <Route index element={<NewGame />} />
        <Route path="/NewGame" element={<NewGame />} />
        <Route path="/ControlPanel" element={<ControlPanel />} />
        <Route path="/AddPoints" element={<AddPoints />} />
        <Route path="/GameHistory" element={<GameHistory />} />
        <Route path="/Draw" element={<Draw />} />
      </Routes>
    </>
  );
}

export default AdminPage;
