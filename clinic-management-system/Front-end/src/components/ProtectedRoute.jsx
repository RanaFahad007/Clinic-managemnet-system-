 import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem("token");
  const userJSON = localStorage.getItem("user");

  if (!token || !userJSON) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userJSON);
    
    // If route requires admin (like dashboard), check role
    if (requireAdmin && user.role !== "clinicAdmin") {
      return <Navigate to="/" replace />;
    }
    
    // For other protected routes (services, etc.), any authenticated user can access
    return children;
  } catch {
    return <Navigate to="/" replace />;
  }
}
