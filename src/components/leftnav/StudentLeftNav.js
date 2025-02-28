import React from "react";
import { NavLink } from "react-router-dom";
import "./StudentLeftNav.css";

const StudentLeftNav = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Student Panel</h2>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/sdashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon">📊</span> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/notifications" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon">🔔</span> Notifications
            </NavLink>
          </li>
          <li>
            <NavLink to="/faculty-connect" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon">👨‍🏫</span> Faculty Connect
            </NavLink>
          </li>
          <li>
            <NavLink to="/post-doubt" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon">❓</span> Post a Doubt
            </NavLink>
          </li>
          <li>
            <NavLink to="/ai-chatbot" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon">🤖</span> AI Chat Bot
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default StudentLeftNav;
