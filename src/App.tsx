import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Routes, Route, Navigate, type NavigateFunction } from "react-router-dom";

import Login from "./View/AcountScreens/loginScreens/Login";
import { Register } from "./View/AcountScreens/registerScreens/Register";
import { Messenger } from "./View/MessengerScreens/Messenger";
import "./index.css";
import Layout from "./View/Admin/layouts/Layouts";
import Dashboard from "./View/Admin/pages/Dashboard";
import Backgrounds from "./View/Admin/pages/Backgrounds";
import Complaints from "./View/Admin/pages/Complaints";
import Users from "./View/Admin/pages/Users";
import toast, { Toaster } from "react-hot-toast";
import { logoutUser } from "./services/logoutUser";
import { getUserRole } from "./services/getUserRole";
import ProtectedRoute from "./ProtectedRoute";
import LogsPage from "./View/Admin/pages/LogsPage";

interface UserType {
  id: number;
  username: string;
}

export default function App() {
  const [user, setUser] = useState<UserType | null>(() => {
    const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        try {
          const roleIsAdmin = await getUserRole(); // true/false dönmeli
          setIsAdmin(roleIsAdmin);
        } catch (error) {
          console.error("Rol bilgisi alınamadı", error);
          setIsAdmin(false);
        }
      };
      fetchUserRole();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleLogout = async (navigate: NavigateFunction) => {
    const result = await logoutUser();

    if (result.success === false) {
      toast.error("Çıkış sırasında hata: " + result.message);
    } else {
      toast.success("Çıkış başarılı: " + result.message);

      setUser(null);
      setIsAdmin(false);
      sessionStorage.clear();
      localStorage.clear();

      navigate("/login");
    }
  };

  return (
    <Box className="app-background">

      <Toaster
        position="top-right"
        gutter={12} // toasts arası boşluk
        containerStyle={{
          top: 20,
          right: 20,
          left: 20,
          maxWidth: "100vw",
          padding: "0 16px",
        }}
        toastOptions={{
          style: {
            fontSize: "clamp(16px, 2.5vw, 18px)", // mobilde büyür, desktopta dengeli
            padding: "clamp(12px, 3vw, 20px)",
            borderRadius: "8px",
            background: "#1f2937", // zinc-800 gibi koyu arka plan
            color: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e", // yeşil
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // kırmızı
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/messenger" />
            ) : (
              <Login
                onLogin={(user: UserType) => {
                  setUser(user);
                }}
              />
            )
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/messenger" />
            ) : (
              <Login
                onLogin={(user: UserType) => {
                  setUser(user);
                }}
              />
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/messenger" />
            ) : (
              <Login
                onLogin={(user: UserType) => {
                  setUser(user);
                }}
              />
            )
          }
        />
        <Route path="/register" element={user ? <Navigate to="/messenger" /> : <Register />} />
        <Route
          path="/messenger"
          element={
            user ? (
              <Messenger isAdmin={isAdmin} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/adminpage"
          element={
            <ProtectedRoute isAllowed={isAdmin} redirectPath="/">
              <Layout isAdmin={isAdmin} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="backgrounds" element={<Backgrounds />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="users" element={<Users />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>

      </Routes>
    </Box>
  );
}
