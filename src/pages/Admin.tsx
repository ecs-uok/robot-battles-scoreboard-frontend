import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar.tsx";
import NewGame from "./NewGame.tsx";
import ControlPanel from "./ControlPanel.tsx";
import AddPoints from "./AddPoints.tsx";
import GameHistory from "./GameHistory.tsx";
import Draw from "./Draw.tsx";
import ManageTeams from "./ManageTeams.tsx";

// Use environment variables for credentials
const ADMIN_USER = import.meta.env.VITE_ADMIN_USER;
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS;
const SESSION_TIMEOUT_MINUTES = 10; // 10 minutes

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Helper: check if session expired
  const isSessionExpired = () => {
    const lastActive = localStorage.getItem("admin_last_active");
    if (!lastActive) return true;
    const last = parseInt(lastActive, 10);
    return Date.now() - last > SESSION_TIMEOUT_MINUTES * 60 * 1000;
  };

  // On mount, check session validity
  useEffect(() => {
    const logged = localStorage.getItem("admin_logged_in");
    if (logged === "true" && !isSessionExpired()) {
      setIsLoggedIn(true);
      // Update last active time
      localStorage.setItem("admin_last_active", Date.now().toString());
    } else {
      setIsLoggedIn(false);
      localStorage.removeItem("admin_logged_in");
      localStorage.removeItem("admin_last_active");
    }
  }, []);

  // Listen for user activity to reset session timer
  useEffect(() => {
    if (!isLoggedIn) return;

    const updateLastActive = () => {
      localStorage.setItem("admin_last_active", Date.now().toString());
    };

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, updateLastActive));

    // Session timeout interval
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        setIsLoggedIn(false);
        localStorage.removeItem("admin_logged_in");
        localStorage.removeItem("admin_last_active");
        alert("Session expired due to inactivity.");
      }
    }, 30 * 1000); // check every 30 seconds

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, updateLastActive));
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_last_active", Date.now().toString());
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_last_active");
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
        <Route path="/ManageTeams" element={<ManageTeams />} />
      </Routes>
    </>
  );
}

export default AdminPage;
