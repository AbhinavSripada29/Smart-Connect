import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase"; // Firestore
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import LoggedHeader from "../../components/logged-header/LoggedHeader";
import FacultyLeftNav from "../../components/leftnav/FacultyLeftNav";
import userSessionStore from "../../lib/userSessionStore"; // Zustand store for user session
import "./Appointments.css"; // Import CSS for styling

const Appointments = () => {
  const { user } = userSessionStore(); // Get logged-in faculty user
  const [faculty, setFaculty] = useState(null); // Faculty details
  const [appointments, setAppointments] = useState([]); // Pending appointments
  const [currentAppointments, setCurrentAppointments] = useState([]); // Pre-Ongoing
  const [ongoingAppointments, setOngoingAppointments] = useState([]); // Ongoing
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch faculty details
  useEffect(() => {
    const fetchFacultyData = async () => {
      if (user?.email) {
        try {
          const querySnapshot = await getDocs(collection(db, "faculty"));
          const facultyData = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .find((f) => f.mailid === user.email);

          if (facultyData) {
            setFaculty(facultyData);
            fetchAppointments(facultyData.mailid);
          } else {
            console.warn("Faculty data not found for:", user.email);
          }
        } catch (error) {
          console.error("Error fetching faculty data:", error);
        }
      }
      setLoading(false);
    };

    fetchFacultyData();
  }, [user]);

  // 🔥 Fetch appointments for faculty
  const fetchAppointments = async (facultyEmail) => {
    try {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const allAppointments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Categorize appointments based on status
      setAppointments(allAppointments.filter((app) => app.facultyEmail === facultyEmail && app.status === "Pending"));
      setCurrentAppointments(allAppointments.filter((app) => app.facultyEmail === facultyEmail && app.status === "Pre-Ongoing"));
      setOngoingAppointments(allAppointments.filter((app) => app.facultyEmail === facultyEmail && app.status === "Ongoing"));
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // 📌 Accept Appointment (Pending ➝ Accepted)
  const acceptAppointment = async (appointmentId) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, { status: "Accepted" });

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: "Accepted" } : app
        )
      );

      alert("Appointment accepted successfully!");
    } catch (error) {
      console.error("Error accepting appointment:", error);
    }
  };

  // 📌 Mark Attendance (Pre-Ongoing ➝ Ongoing / Cancelled)
  const markAttendance = async (appointmentId, attended) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      const newStatus = attended ? "Ongoing" : "Cancelled";

      await updateDoc(appointmentRef, { status: newStatus });

      setCurrentAppointments((prev) => prev.filter((app) => app.id !== appointmentId));
      if (attended) {
        setOngoingAppointments((prev) => [...prev, { id: appointmentId, status: "Ongoing" }]);
      }

      alert(`Appointment marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  // 📌 Mark Meeting as Completed (Ongoing ➝ Completed)
  const completeMeeting = async (appointmentId) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, { status: "Completed" });

      setOngoingAppointments((prev) => prev.filter((app) => app.id !== appointmentId));

      alert("Meeting marked as Completed!");
    } catch (error) {
      console.error("Error updating meeting status:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <LoggedHeader />
      <div className="dashboard-container">
        <FacultyLeftNav />
        <div className="dashboard-content">
          <h1>📅 Appointment Requests</h1>

          {/* 📌 Pending Appointments */}
          {appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <h3>Student: {appointment.studentName}</h3>
                  <p><strong>Email:</strong> {appointment.studentEmail}</p>
                  <button className="accept-btn" onClick={() => acceptAppointment(appointment.id)}>✅ Accept</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments">No pending appointment requests.</p>
          )}

          {/* 📌 Current Appointments (Pre-Ongoing) */}
          <h2>📌 Current Appointments</h2>
          {currentAppointments.length > 0 ? (
            <div className="appointments-list">
              {currentAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <h3>Student: {appointment.studentName}</h3>
                  <p>Did the student attend?</p>
                  <button className="accept-btn" onClick={() => markAttendance(appointment.id, true)}>✅ Yes</button>
                  <button className="reject-btn" onClick={() => markAttendance(appointment.id, false)}>❌ No</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments">No current appointments.</p>
          )}

          {/* 📌 Current Meetings (Ongoing) */}
          <h2>📌 Current Meetings</h2>
          {ongoingAppointments.length > 0 ? (
            <div className="appointments-list">
              {ongoingAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card ongoing">
                  <h3>Student: {appointment.studentName}</h3>
                  <p>Is the meeting with the student Completed?</p>
                  <button className="yes-btn" onClick={() => completeMeeting(appointment.id)}>✅ Yes</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments">No ongoing meetings.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
