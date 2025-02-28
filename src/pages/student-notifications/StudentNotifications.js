import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase"; // Firestore
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import userSessionStore from "../../lib/userSessionStore"; // Zustand store
import LoggedHeader from "../../components/logged-header/LoggedHeader";
import StudentLeftNav from "../../components/leftnav/StudentLeftNav";
import "./StudentNotifications.css"; // Styling file

const StudentNotifications = () => {
  const { user } = userSessionStore(); // Get logged-in student
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch accepted appointments for the student
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.email) return;

      try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const allAppointments = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            acceptedTime: data.timestamp ? data.timestamp.toDate() : null, // Convert Firestore timestamp to JS Date
          };
        });

        // Filter appointments where studentEmail matches and status is "Accepted"
        const acceptedAppointments = allAppointments.filter(
          (appointment) =>
            appointment.studentEmail === user.email && appointment.status === "Accepted"
        );

        setNotifications(acceptedAppointments);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }

      setLoading(false);
    };

    fetchNotifications();
  }, [user]);

  // 🔄 Function to update appointment status in Firestore
  const handleMeetingResponse = async (appointmentId, response) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      const newStatus = response === "yes" ? "Pre-Ongoing" : "Cancelled";

      await updateDoc(appointmentRef, { status: newStatus });

      // ✅ Update state immediately for better UX
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === appointmentId ? { ...notif, status: newStatus } : notif
        )
      );

      alert(`Meeting status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <LoggedHeader />

      <div className="dashboard-container">
        <StudentLeftNav />

        <div className="dashboard-content">
          <h1>🔔 Notifications</h1>

          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map((notification) => {
                const currentTime = new Date();
                const meetingTime = notification.acceptedTime;
                const timeDiff = meetingTime
                  ? (meetingTime - currentTime) / (1000 * 60) // Convert ms to minutes
                  : null;

                return (
                  <div key={notification.id} className="notification-card">
                    <h3>📢 Your Appointment was Accepted!</h3>
                    <p><strong>Faculty:</strong> {notification.facultyName}</p>
                    <p>
                      <strong>Accepted On:</strong>{" "}
                      {meetingTime ? meetingTime.toLocaleString() : "N/A"}
                    </p>

                    {/* ✅ Show prompt only if meeting starts in <= 10 minutes */}
                    {timeDiff !== null && timeDiff <= 10 && notification.status === "Accepted" && (
                      <div className="meeting-confirmation">
                        <p>⚡ Are you attending the meeting in the next 10 min?</p>
                        <button onClick={() => handleMeetingResponse(notification.id, "yes")} className="yes-btn">✅ Yes</button>
                        <button onClick={() => handleMeetingResponse(notification.id, "no")} className="no-btn">❌ No</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-notifications">No new notifications.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentNotifications;
