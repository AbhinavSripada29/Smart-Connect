import React from "react";
import { NavLink } from "react-router-dom";
import "./FacultyLeftNav.css";

const FacultyLeftNav = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Faculty Panel</h2>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/faculty-dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon">📊</span> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/student-queries" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon">💬</span> Student Queries
            </NavLink>
          </li>
          <li>
            <NavLink to="/appointments" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon">📅</span> Appointments
            </NavLink>
          </li>
          <li>
            <NavLink to="/resources" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon">📚</span> Resources
            </NavLink>
          </li>
          <li>
            <NavLink to="/faculty-notifications" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="icon">🔔</span> Notifications
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default FacultyLeftNav;
