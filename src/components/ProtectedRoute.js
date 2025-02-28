import { Navigate } from "react-router-dom";
import userSessionStore from "../lib/userSessionStore";

const ProtectedRoute = ({ children, userType }) => {
  const { user, userType: storedUserType } = userSessionStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Ensure user is accessing the correct dashboard
  if (userType && storedUserType !== userType) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
