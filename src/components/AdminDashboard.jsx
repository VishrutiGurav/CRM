import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { RadialBarChart, RadialBar } from "recharts";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaPauseCircle } from "react-icons/fa";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios"; // Import Axios for API calls

const data = [
  { name: "Mon", requests: 5 },
  { name: "Tue", requests: 8 },
  { name: "Wed", requests: 6 },
  { name: "Thu", requests: 10 },
  { name: "Fri", requests: 7 },
  { name: "Sat", requests: 12 },
  { name: "Sun", requests: 9 },
];

const mouData = [
  { name: "Total Submitted", value: 120, fill: "#007bff" }
];

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize navigation

const handleReviewClick1 = () => {
  navigate("/Review"); // Replace with your actual route
};
  const [newRequest, setNewRequest] = useState(false); // State for red dot blinking
  const [totalRequests, setTotalRequests] = useState(0); // Stores the client count

  useEffect(() => {
    const socket = io("http://localhost:8080");
  
    const fetchClientCount = async () => {
      try {
        const response = await axios.get("http://localhost:8080/client/count");
        setTotalRequests(response.data.totalRequests);
        console.log("🔹 Fetched total requests:", response.data.totalRequests);
      } catch (error) {
        console.error("❌ Error fetching client count:", error);
      }
    };
  
    fetchClientCount(); // Fetch count on component mount
  
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.io server", socket.id);
    });
  
    socket.on("newClientRequest", async () => {
      console.log("🚀 New client request received!");
      setNewRequest(true); // Show blinking dot
      console.log("🔴 Blinking dot state updated:", true);
      await fetchClientCount(); // Fetch updated count
    });
  
    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });
  
    return () => {
      socket.disconnect();
      console.log("⚠️ Socket disconnected");
    };
  }, []);
  

  const handleReviewClick = () => {
    setNewRequest(false); // Remove blinking dot
  };

  return (
    <>
      <div className="dashboard-container">
        {/* Section for New Requests */}
        <div className="new-requests-section">
          <div className="section-heading"><h2>New Requests</h2></div>
          <span className="count">Total: 45</span>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="action-container">
          <div className="notification-icon">
            {newRequest && <span className="red-dot blinking"></span>} {/* Blinking red dot */}
            <span>New Request Alert</span>
          </div>
          <button className="review-btn" onClick={handleReviewClick1}>
  {newRequest && <span className="red-short"></span>} {/* Red indicator */}
  Review Requests
</button>

        </div>
        </div>

        {/* Expiry Overview Section */}
        <div className="expiry-overview-section">
          <div className="section-heading"><h2>Expiry Overview</h2></div>
          <div className="expiry-alert">
            <span className="red-dot"></span>
            <span>MoU with XYZ Pvt. Ltd is expiring in 3 days</span>
          </div>
          <div className="section-heading"><h3>Upcoming Expiries</h3></div>
          <div className="expiry-bars">
            <div className="expiry-bar">
              <span className="red-dot"></span>
              <span>Name 1</span>
            </div>
            <div className="expiry-bar">
              <span className="yellow-dot"></span>
              <span>Name 2</span>
            </div>
            <div className="expiry-bar">
              <span className="green-dot"></span>
              <span>Name 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Container for Follow Ups & MoU Sections */}
      <div className="mou-status-container">
        {/* Follow Ups Section (Horizontally placed) */}
<div className="follow-ups-section">
  <div className="section-heading"><h2>Follow Ups</h2></div>
  
  <table className="follow-ups-table">
    <thead>
      <tr>
        <th>Client Name</th>
        <th>Follow-Up Status</th>
        <th>Last Contacted</th>
        <th>Next Follow-Up</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td className="status awaiting">Awaiting Response</td>
        <td>5 Feb 2025</td>
        <td>20 Feb 2025</td>
        <td>
          <button className="action-btn">
            <i className="fas fa-calendar-alt"></i> Reschedule
          </button>
        </td>
      </tr>
      <tr>
        <td>Jane Smith</td>
        <td className="status completed">Completed</td>
        <td>3 Feb 2025</td>
        <td>—</td>
        <td>
          <button className="action-btn">
            <i className="fas fa-check-circle"></i> Done
          </button>
        </td>
      </tr>
      <tr>
        <td>Michael Lee</td>
        <td className="status in-progress">In Progress</td>
        <td>1 Feb 2025</td>
        <td>10 Feb 2025</td>
        <td>
          <button className="action-btn">
            <i className="fas fa-clock"></i> Follow Up
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>


        {/* Container for the Two Stacked Sections */}
        <div className="mou-status-column">
        <div className="detailed-mou-status">
  <div className="section-heading"><h2>Detailed MoU Status</h2></div>
  
  
  {/* Cards Container */}
  <div className="mou-cards-container">
        {mouData.map((item, index) => (
          <div className="mou-card" key={index}>
            <h3>{item.name}</h3>
            {/* Circular Progress Bar */}
            <div className="progress-bar-container">
              <ResponsiveContainer width={80} height={80}>
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  data={[item]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar minAngle={15} background dataKey="value" />
                </RadialBarChart>
              </ResponsiveContainer>
              <span className="progress-text">{item.value}%</span>
            </div>
          </div>
        ))}

   {/* Card 2 - Awaiting Review */}
   <div className="mou-card">
          <h3>Awaiting Review Count</h3>
          <span className="big-count">35</span>
          <button className="review-btn">Review</button>
        </div>

        {/* Card 3 - Reviewed by Admin */}
        <div className="mou-card">
          <h3>Reviewed by Admin</h3>
          <span className="big-count">85</span>
          <button className="review-btn">Review</button>
        </div>

  </div>
</div>
<div className="mou-signing-status">
      <div className="section-heading">
        <h2>MoU Signing Status</h2>
      </div>

      {/* Status Boxes Container */}
      <div className="status-container">
        {/* Pending */}
        <div className="status-box pending">
          <FaHourglassHalf className="icon" />
          <h3>Pending</h3>
          <span className="count">12</span>
        </div>

        {/* Accepted */}
        <div className="status-box accepted">
          <FaCheckCircle className="icon" />
          <h3>Accepted</h3>
          <span className="count">45</span>
        </div>

        {/* Rejected */}
        <div className="status-box rejected">
          <FaTimesCircle className="icon" />
          <h3>Rejected</h3>
          <span className="count">8</span>
        </div>

        {/* Hold Up */}
        <div className="status-box hold">
          <FaPauseCircle className="icon" />
          <h3>Hold Up</h3>
          <span className="count">5</span>
        </div>
      </div>
    </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
