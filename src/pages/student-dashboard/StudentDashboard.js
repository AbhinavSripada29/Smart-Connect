import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";
import LoggedHeader from "../../components/logged-header/LoggedHeader";
import StudentLeftNav from "../../components/leftnav/StudentLeftNav";
import { db } from "../../lib/firebase"; // Firestore Database
import { doc, getDoc } from "firebase/firestore";
import userSessionStore from "../../lib/userSessionStore"; // Zustand Store

const StudentDashboard = () => {
  const { user } = userSessionStore(); // Get logged-in user from Zustand
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Student Data from Firestore
  useEffect(() => {
    const fetchStudentData = async () => {
      if (user) {
        try {
          const studentRef = doc(db, "students", user.uid); // Assuming "students" collection
          const studentSnap = await getDoc(studentRef);

          if (studentSnap.exists()) {
            setStudent(studentSnap.data());
          } else {
            console.log("No student data found!");
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
      setLoading(false);
    };

    fetchStudentData();
  }, [user]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!student) {
    return <div className="error">No student data found.</div>;
  }

  return (
    <div className="dashboard-page">
      <LoggedHeader />

      <div className="dashboard-container">
        <StudentLeftNav />

        <div className="dashboard-content">
          {/* Top Section with Background Banner */}
          <div className="dashboard-banner">
            <div className="profile-avatar">
              <img src={student.profilePic || "https://cdn.pfps.gg/pfps/2301-default-2.png"} alt="Profile" />
            </div>
          </div>

          {/* Student Details Section */}
          <div className="profile-details">
            <h2>{student.username}</h2>
            <p>{student.email}</p>
            <div className="student-info">
              <span><strong>Register Number:</strong> {student.rollNo}</span>
              <span><strong>Degree:</strong> {student.degree}</span>
              <span><strong>Batch:</strong> {student.batch}</span>
              <span><strong>College:</strong> {student.college}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
