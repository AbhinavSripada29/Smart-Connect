import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Gemini AI SDK
import "./AiChatbot.css"; // Import styling
import LoggedHeader from "../../components/logged-header/LoggedHeader"; // Header Component
import FacultyLeftNav from "../../components/leftnav/FacultyLeftNav"; // Left Nav
import StudentLeftNav from "../../components/leftnav/StudentLeftNav";

const API_KEY = "AIzaSyAstR8lKbiRVV80ZEQHUTOo6OGjO7IzO8o"; // Replace with your Gemini API Key

const AiChatbot = () => {
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [input, setInput] = useState(""); // User input field
  const [loading, setLoading] = useState(false); // Loading state for responses
  const chatEndRef = useRef(null); // Ref for auto-scrolling

  const genAI = new GoogleGenerativeAI(API_KEY); // Initialize Gemini API

  // Function to send user input to Gemini AI and receive response
  const sendMessage = async () => {
    if (!input.trim()) return; // Ignore empty messages

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages); // Update UI immediately
    setInput(""); // Clear input field
    setLoading(true); // Show loading state

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const response = await model.generateContent(input);
      const aiMessage = response.response.text();

      setMessages([...newMessages, { text: aiMessage, sender: "ai" }]); // Append AI response
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages([...newMessages, { text: "⚠️ Sorry, something went wrong!", sender: "ai" }]);
    }

    setLoading(false); // Hide loading state
  };

  // Auto-scroll chat window to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="dashboard-page">
      <LoggedHeader /> {/* Header */}
      <div className="dashboard-container">
        <StudentLeftNav /> {/* Left Navigation */}
        <div className="chat-container">
          <h1>🤖 AI Chatbot</h1>

          <div className="chat-box">
            {messages.length === 0 && <p className="welcome-message">👋 Hello! Ask me anything.</p>}
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="loading-message">⏳ Thinking...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={loading}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChatbot;
