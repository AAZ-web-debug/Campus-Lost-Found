import React from "react";
import { Navigate } from "react-router-dom";
import {
  isAuthenticated,
  isAdmin
} from "../services/auth";

function AdminRoute({ children }) {

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isAdmin()) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default AdminRoute;