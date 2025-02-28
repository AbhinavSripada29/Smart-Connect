import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase"; // Firestore
import { collection, getDocs } from "firebase/firestore";
import LoggedHeader from "../../components/logged-header/LoggedHeader";
import FacultyLeftNav from "../../components/leftnav/FacultyLeftNav";
import userSessionStore from "../../lib/userSessionStore"; // Zustand store
import "./FacultyNotifications.css"; // CSS for styling

const FacultyNotifications = () => {
  const { user } = userSessionStore(); // Get logged-in faculty user
  const [faculty, setFaculty] = useState(null); // Faculty details
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch faculty details
  useEffect(() => {
    const fetchFacultyData = async () => {
      if (!user?.email) return;

      try {
        const querySnapshot = await getDocs(collection(db, "faculty"));
        const facultyData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .find((f) => f.mailid === user.email);

        if (facultyData) setFaculty(facultyData);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
      setLoading(false);
    };

    fetchFacultyData();
  }, [user]);

  // 🔥 Fetch "Pre-Ongoing" Appointments
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!faculty) return;

      try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const upcomingAppointments = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            acceptedTime: doc.data().timestamp ? doc.data().timestamp.toDate() : null,
          }))
          .filter(
            (appointment) =>
              appointment.facultyEmail === faculty.mailid &&
              appointment.status === "Pre-Ongoing"
          );

        setNotifications(upcomingAppointments);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [faculty]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <LoggedHeader />
      <div className="dashboard-container">
        <FacultyLeftNav />

        <div className="dashboard-content">
          <h1>🔔 Faculty Notifications</h1>

          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map((notification) => {
                const currentTime = new Date();
                const meetingTime = notification.acceptedTime;
                const timeDiff = meetingTime
                  ? (meetingTime - currentTime) / (1000 * 60) // Convert ms to minutes
                  : null;

                return (
                  <div
                    key={notification.id}
                    className={`notification-card ${
                      timeDiff !== null && timeDiff <= 10 ? "urgent" : ""
                    }`}
                  >
                    <h3>📢 Student Will Attend!</h3>
                    <p><strong>Student:</strong> {notification.studentName}</p>
                    <p><strong>Email:</strong> {notification.studentEmail}</p>
                    <p><strong>Meeting Time:</strong> {meetingTime ? meetingTime.toLocaleString() : "N/A"}</p>

                    {timeDiff !== null && timeDiff <= 10 && (
                      <p className="urgent-alert">⚠️ Student arriving in the next 10 minutes!</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-notifications">No upcoming meetings.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyNotifications;
