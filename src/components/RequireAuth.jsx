import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // your auth hook

export default function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();
  if (!auth.user) {
    // redirect to login with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
