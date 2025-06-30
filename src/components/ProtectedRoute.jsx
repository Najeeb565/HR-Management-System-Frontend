import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const superadminString = localStorage.getItem("superadmin");

  // ✅ Special case: Superadmin route
  if (allowedRoles.includes("superadmin")) {
    if (!superadminString) return <Navigate to="/superadminlogin" />;

    try {
      const superadmin = JSON.parse(superadminString);
      if (superadmin.role === "superadmin") {
        return children;
      } else {
        return <Navigate to="/unauthorized" />;
      }
    } catch (err) {
      localStorage.removeItem("superadmin");
      return <Navigate to="/superadminlogin" />;
    }
  }

  // ✅ For normal users (admin / employee)
  if (!token || !userString) {
    return <Navigate to="/login" />;
  }

  try {
    const user = JSON.parse(userString);
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
    }
    return children;
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
