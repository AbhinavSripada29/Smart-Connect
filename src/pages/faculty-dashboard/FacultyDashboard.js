import React, { useEffect, useState } from "react";
import "./FacultyDashboard.css";
import LoggedHeader from "../../components/logged-header/LoggedHeader";
import FacultyLeftNav from "../../components/leftnav/FacultyLeftNav";
import { db } from "../../lib/firebase"; // Firestore Database
import { collection, query, where, getDocs } from "firebase/firestore";
import userSessionStore from "../../lib/userSessionStore"; // Zustand Store

const FacultyDashboard = () => {
  const { user } = userSessionStore(); // Get logged-in faculty user
  const [faculty, setFaculty] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyData = async () => {
      if (user?.email) {
        try {
          // Query Firestore to find the faculty document where mailid matches the user's email
          const facultyQuery = query(collection(db, "faculty"), where("mailid", "==", user.email));
          const querySnapshot = await getDocs(facultyQuery);

          if (!querySnapshot.empty) {
            // Get the first matching document
            const facultyData = querySnapshot.docs[0].data();
            setFaculty(facultyData);
          } else {
            console.log("No faculty data found for this email!");
          }
        } catch (error) {
          console.error("Error fetching faculty data:", error);
        }
      }
      setLoading(false);
    };

    fetchFacultyData();
  }, [user]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <LoggedHeader />

      <div className="dashboard-container">
        <FacultyLeftNav />

        <div className="dashboard-content">
          {/* Top Section with Background Banner */}
          <div className="dashboard-banner">
            <div className="profile-avatar">
              <img src={faculty.profilePic || "https://cdn.pfps.gg/pfps/2301-default-2.png"} alt="Profile" />
            </div>
          </div>

          {/* Faculty Details Section */}
          <div className="profile-details">
            <h2>{faculty.name || " "}</h2>
            <p>{faculty.mailid || " "}</p>
            <div className="faculty-info">
              <span><strong>Department:</strong> {faculty.department || " "}</span>
              <div className="expertise-section">
                <strong>Expertise:</strong>
                <ul>
                  {faculty.expertise && faculty.expertise.length > 0 ? (
                    faculty.expertise.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))
                  ) : (
                    <li> </li> // Empty list item if no expertise is provided
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
