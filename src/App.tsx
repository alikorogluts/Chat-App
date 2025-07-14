import { useState } from "react";
import { Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./View/AcountScreens/Login";
import { Register } from './View/AcountScreens/Register';
import { Messenger } from "./View/MessengerScreens/Messenger";

import "./index.css";

export default function App() {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);

  const handleLogout = () => {
    setUser(null);
    sessionStorage.clear();
    localStorage.clear();
  };

  return (
    <Box className="app-background">
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/messenger" /> : <Login onLogin={setUser} />
          }
        />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/messenger" /> : <Login onLogin={setUser} />
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/login" />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/messenger"
          element={
            user ? (
              <Messenger user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Box>
  );
}
