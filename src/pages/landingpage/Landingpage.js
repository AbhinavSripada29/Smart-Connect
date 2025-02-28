import React from "react";
import { Link } from "react-router-dom";
import "./Landingpage.css";
import Header from "../../components/header/Header";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <Header />
      <div className="landing-content">
        {/* Left Section: Text */}
        <div className="text-section">
          <h1>VNR VJIET Smart Student-Faculty Interaction</h1>
          <p>
            A seamless platform designed for VNR VJIET students and faculty to collaborate,
            schedule appointments, and enhance academic success efficiently.
          </p>
          <div className="buttons">
            <Link to="/register" className="explore-btn">Get Started</Link>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="image-section">
          <img
            src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg"
            alt="Faculty-Student Interaction"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
