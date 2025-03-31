import React from "react";
import "./MouReviewAdmin.css";
import { FaUserCircle } from "react-icons/fa";

const MouReviewAdmin = () => {
    return (
        <div className="header-container">
          <h1 className="heading">MouReview</h1>
          <div className="underline"></div>
          
          <div className="card-container">
            <div className="card client-card">
              <div className="client-header">
                <FaUserCircle className="avatar-icon" />
                <h2 className="card-heading">Client Profile</h2>
              </div>
              <div className="underline"></div>
              <div className="client-details">
                <div className="detail-row">
                  <span className="detail-label">📅 Submitted Date:</span>
                  <span className="detail-value">March 30, 2025</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">👤 Name:</span>
                  <span className="detail-value">John Doe</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📧 Email:</span>
                  <span className="detail-value">johndoe@example.com</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📞 Phone:</span>
                  <span className="detail-value">+1 234 567 890</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🏫 University:</span>
                  <span className="detail-value">Harvard University</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📚 Course:</span>
                  <span className="detail-value">Computer Science</span>
                </div>
              </div>
            </div>
            <div className="card notes-card">
              <h2 className="card-heading">Admin Notes</h2>
              <div className="underline"></div>
              <textarea className="notes-textarea" placeholder="Write notes or reminders here..."></textarea>
              <div className="button-container">
                <button className="save-button"> Save</button>
                <button className="clear-button"> Clear</button>
              </div>
            </div>
          </div>

           {/* Action & Decision Panel */}
           <div className="action-panel">
            <h2 className="panel-heading">Action and Decision Panel</h2>
            <div className="underline"></div>
            <div className="action-buttons">
              <button className="approve-button">✔ Approve</button>
              <button className="reject-button">❌ Reject</button>
              <button className="request-button">🔄 Request Changes</button>
              <button className="draft-button">💾 Save as Draft</button>
              <button className="review-button">⏳ Review Later</button>
            </div>
          </div>
        </div>
      );
};
    
 
export default MouReviewAdmin;
