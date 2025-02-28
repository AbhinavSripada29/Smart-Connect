import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { db } from "../../lib/firebase"; // Firestore import
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Authentication
import "./StudentConnect.css";

const StudentConnect = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [student, setStudent] = useState(null); // Dynamically fetched student details
  const auth = getAuth();

  // 🔥 Fetch logged-in student's details from Firestore
  useEffect(() => {
    const fetchStudentData = async (user) => {
      try {
        const q = query(collection(db, "students"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const studentData = querySnapshot.docs[0].data();
          setStudent({
            name: studentData.name,
            department: studentData.department,
          });
        } else {
          console.warn("Student data not found for:", user.email);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchStudentData(user);
      } else {
        setStudent(null);
      }
    });
  }, [auth]);

  // 🔥 Fetch faculty data from Firestore, including `mailid` (faculty email)
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "faculty"));
        const facultyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFacultyList(facultyData);
      } catch (error) {
        console.error("Error fetching faculty:", error);
      }
    };

    fetchFaculty();
  }, []);

  // 🔍 Filter faculty based on search, department & availability
  const filteredFaculty = facultyList.filter((faculty) => {
    return (
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedDepartment === "" || faculty.department === selectedDepartment) &&
      faculty.available === true // Only show available faculty
    );
  });

  // 📅 Request Appointment (Updated ✅)
  const requestAppointment = async (faculty) => {
    if (!student) {
      alert("Student details not loaded. Please try again.");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        studentName: student.name,
        studentDepartment: student.department,
        studentEmail: auth.currentUser.email,
        facultyName: faculty.name,
        facultyEmail: faculty.mailid, // ✅ Fetching faculty email from Firestore
        facultyDepartment: faculty.department,
        status: "Pending",
        timestamp: new Date(),
      });

      alert(`Appointment request sent to ${faculty.name}`);
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div className="student-connect-container">
      {/* Sidebar */}
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

      {/* Faculty Connect Content */}
      <div className="faculty-connect-content">
        <h1>Faculty Connect</h1>

        {/* 🔍 Search & Filter Section */}
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search faculty by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <select
            className="filter-dropdown"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
          </select>
        </div>

        {/* 🎓 Faculty Cards */}
        <div className="faculty-list">
          {filteredFaculty.length > 0 ? (
            filteredFaculty.map((faculty) => (
              <div className="faculty-card" key={faculty.id}>
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt={faculty.name} className="faculty-avatar" />
                <h3>{faculty.name}</h3>
                <p><strong>Department:</strong> {faculty.department}</p>
                
                {/* ✅ Extract subject from expertise array */}
                <p><strong>Subject:</strong> {faculty.expertise && faculty.expertise.length > 0 ? faculty.expertise[0] : "Not Specified"}</p>
                
                {/* 📧 Show Faculty Email */}
                <p><strong>Email:</strong> {faculty.mailid || "Not Available"}</p>

                {/* 🔄 Check Availability */}
                {faculty.available ? (
                  <button className="request-slot-btn" onClick={() => requestAppointment(faculty)}>Request Slot</button>
                ) : (
                  <p className="not-available">❌ Faculty Unavailable</p>
                )}
              </div>
            ))
          ) : (
            <p className="no-results">No available faculty found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentConnect;
