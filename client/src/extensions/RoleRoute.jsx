// RoleRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, allowedRole }) {
  const { isAuthenticated, role,loading } = useSelector((state) => state.auth);
   if (loading) return <div>Loading...</div>;   
     console.log("RoleRoute: ", { isAuthenticated, role, loading ,allowedRole});

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (role !== allowedRole) return <Navigate to="/unauthorized" />;

  return children;
}
