import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        <h1>Smart Connect</h1>
      </div>
      <div className="login">
        <Link to="/login" className="login-button">Login</Link>
      </div>
    </header>
  );
};

export default Header;
