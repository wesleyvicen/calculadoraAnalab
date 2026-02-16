import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AppNavbar from "./AppNavbar";

function AuthCheckingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid #d5d8de",
          background: "#ffffff",
          boxShadow: "0 10px 20px rgba(15, 23, 42, 0.08)",
          color: "#334155",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "2px solid #bfdbfe",
            borderTopColor: "#2563eb",
            animation: "auth-spin 0.7s linear infinite",
          }}
        />
        Validando acesso...
      </div>
      <style>
        {`@keyframes auth-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}

export function ProtectedRoute() {
  const { loading, session } = useAuth();

  if (loading) {
    return <AuthCheckingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <AppNavbar />
      <Outlet />
    </>
  );
}

export function GuestRoute() {
  const { loading, session } = useAuth();

  if (loading) {
    return <AuthCheckingScreen />;
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { loading, session, isAdmin } = useAuth();

  if (loading) {
    return <AuthCheckingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AppNavbar />
      <Outlet />
    </>
  );
}
