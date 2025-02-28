import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserSessionStore from "../../lib/userSessionStore";
import "./LoggedHeader.css";

const LoggedHeader = () => {
  const navigate = useNavigate();
  const { logout } = useUserSessionStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <header className="logged-header">
      <div className="logo">
        <h1>Smart Connect</h1>
      </div>
      <div className="header-right">
        <Link to="/profile" className="profile-button">Profile</Link>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default LoggedHeader;
