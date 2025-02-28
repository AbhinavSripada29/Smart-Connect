import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './pages/landingpage/Landingpage';
import Register from './pages/registerpage/Register';
import Login from './pages/loginpage/Login';
import StudentDashboard from './pages/student-dashboard/StudentDashboard';
import StudentConnect from './pages/student-connect/StudentConnect';
import StudentNotifications from './pages/student-notifications/StudentNotifications';
import FacultyDashboard from './pages/faculty-dashboard/FacultyDashboard';
import Appointments from './pages/faculty-appointments/Appointments';
import FacultyNotifications from './pages/faculty-notifications/FacultyNotifications';
import AiChatbot from './pages/ai-chatbot/AiChatbot'; // ✅ Import AI Chatbot
import ProtectedRoute from './components/ProtectedRoute';
import useUserSessionStore from './lib/userSessionStore';

function App() {
  const { initializeAuth, user } = useUserSessionStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* 🎓 Student Routes (Protected) */}
          <Route 
            path="/sdashboard" 
            element={
              <ProtectedRoute userType="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty-connect" 
            element={
              <ProtectedRoute userType="student">
                <StudentConnect />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute userType="student">
                <StudentNotifications />
              </ProtectedRoute>
            } 
          />

          {/* 🏫 Faculty Routes (Protected) */}
          <Route 
            path="/faculty-dashboard" 
            element={
              <ProtectedRoute userType="faculty">
                <FacultyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute userType="faculty">
                <Appointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty-notifications" 
            element={
              <ProtectedRoute userType="faculty">
                <FacultyNotifications />
              </ProtectedRoute>
            } 
          />

          {/* 🤖 AI Chatbot Route (Protected for both Students & Faculty) */}
          <Route 
            path="/ai-chatbot" 
            element={
              <ProtectedRoute userType="student"> 
                <AiChatbot />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
