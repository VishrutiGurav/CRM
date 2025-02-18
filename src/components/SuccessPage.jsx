import React from "react";
import { useNavigate } from "react-router-dom";
import "./Success.css";

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/ClientDashboard"); // Change "/dashboard" to your actual route
  };

  return (
    <div className="success-container">
      <div className="success-box">
        <h1>Submitted Successfully</h1>
        <div className="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-icon"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <p>Check your Email you have received a confirmation</p>

        {/* Go to Dashboard Button */}
        <button className="dashboard-button" onClick={handleGoToDashboard}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;

