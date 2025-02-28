import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserSessionStore from "../../lib/userSessionStore";
import "./Login.css";
import Header from "../../components/header/Header";

const Login = () => {
  const navigate = useNavigate();
  const { login, user, initializeAuth, userType } = useUserSessionStore();
  const [studentData, setStudentData] = useState({ email: "", password: "" });
  const [facultyData, setFacultyData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  useEffect(() => {
    if (user) {
      navigate(userType === "faculty" ? "/faculty-dashboard" : "/sdashboard");
    }
  }, [user, userType, navigate]);

  const handleChange = (e, userType) => {
    const { name, value } = e.target;
    if (userType === "student") {
      setStudentData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFacultyData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e, userType) => {
    e.preventDefault();
    setError("");

    const data = userType === "student" ? studentData : facultyData;
    if (!data.email || !data.password) {
      setError(`Please fill in all ${userType} fields.`);
      return;
    }

    try {
      await login(data.email, data.password, userType);
      navigate(userType === "faculty" ? "/faculty-dashboard" : "/sdashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <Header />
      <div className="login-wrapper">
        <div className="login-card">
          <h2>Student Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={(e) => handleSubmit(e, "student")}>
            <input
              type="email"
              name="email"
              placeholder="Student Email"
              value={studentData.email}
              onChange={(e) => handleChange(e, "student")}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={studentData.password}
              onChange={(e) => handleChange(e, "student")}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>

        <div className="login-card">
          <h2>Faculty Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={(e) => handleSubmit(e, "faculty")}>
            <input
              type="email"
              name="email"
              placeholder="Faculty Email"
              value={facultyData.email}
              onChange={(e) => handleChange(e, "faculty")}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={facultyData.password}
              onChange={(e) => handleChange(e, "faculty")}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
