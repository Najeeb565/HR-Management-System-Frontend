// components/ProtectedSuperAdminRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedSuperAdminRoute = ({ children }) => {
  const superadmin = JSON.parse(localStorage.getItem("superadmin"));

  if (!superadmin || superadmin.role !== "superadmin") {
    return <Navigate to="/superadminlogin" replace />;
  }

  return children;
};

export default ProtectedSuperAdminRoute;
