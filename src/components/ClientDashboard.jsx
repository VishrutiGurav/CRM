
//import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";  // Import axios for API calls

import lang from "../assets/lang.png";
import bell from "../assets/bell.png";
import bar from "../assets/bar.png";
import pro from "../assets/pro.jpg";
import profile from "../assets/profile.png";
import settingc1 from "../assets/settingc1.png";
import search from "../assets/search.png";
import closeicon from "../assets/close-icon.png";
import openicon from "../assets/open-icon.png";
import "./ClientDashboard.css";

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
      const [clients, setClientData] = useState([]);
      const userEmail = localStorage.getItem('userEmail'); // 🔹 Login केलेल्या client चा email
      //console.log("User Email from LocalStorage:", userEmail);
      useEffect(() => {
        fetch("http://localhost:8080/client/getDetails?email=${userEmail}")
            .then((response) => response.json())
            .then((data) => {
              console.log("User Email:", userEmail?.toLowerCase().trim());
              console.log("Emails in Data:", data.map(client => client.personalDetails?.email?.toLowerCase().trim()));
          
              const filteredClient = data.filter(client => 
                  client.personalDetails?.email?.toLowerCase().trim() === userEmail?.toLowerCase().trim()
              );
          
              console.log("Filtered Client Data:", filteredClient);
                setClientData(filteredClient);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);
    

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    
    // Function to handle modal open
    const openModal = (client) => {
      setSelectedClient(client);
      setIsModalOpen(true);
    };
    
    // Function to handle modal close
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedClient(null);
    };
    


    const cardsData = [
      { title: "IN PROGRESS  2", symbol: "🔄" },  // Refresh symbol
      { title: "PENDINGS   4", symbol: "⏳" },   // Hourglass symbol
      { title: "COMPLETED 3", symbol: "✅" }, // Checkmark
      { title: "CANCELLED 1", symbol: "❌" }   // Cross
    ];
    const transactions = [
      { id: "#BR2150", name: "Smith", date: "07 Oct, 2021", followup: "09 Nov 2023", status: "Pending" },
      { id: "#BR2149", name: "James", date: "07 Oct, 2021", followup: "18 Nov 2023", status: "In progress" },
      { id: "#BR2148", name: "Jill", date: "06 Oct, 2021", followup: "09 Nov 2023", status: "Completed" }
  ];
  
 
    // Sidebar Toggle Function
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleRightSidebar = () => {
      setIsRightSidebarOpen(!isRightSidebarOpen);
    };


  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
          <h1>MENU</h1>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <img src={isSidebarOpen ? closeicon : openicon} alt="Toggle Sidebar" style={{ width: "30px", height: "30px" }}/>
          </button>
        </div>
        <nav>
          <a href="#" className="active">Dashboards</a>
          <a href="#">Charts</a>
          <a href="#">Projects</a>
          <a href="#">Contacts</a>
          <a href="#">MOU'S Status</a>
          <a href="#">Logout</a>
        </nav>
      </aside>
{/* Main Content */}
 <div className={`main-content ${isSidebarOpen ? "shrink" : "expand"}`}>

        {/* Top Bar */}
        <div className="topbar">
           {/* Left side - Dashboard  text */}
            <div className="dashboard-title">
              <h1>Client-Dashboard</h1>
            </div>
          <div className="search-bar">
          <img src={search}alt="search" className="icon-img" />
            <input type="text" placeholder="Search..." />
          </div>

           {/* Icons */}
            <div className="icon-group">
                <img src={lang}alt="Language" className="icon-img" />
                <img src={bell} alt="Notifications" className="icon-img" />
                <img src={settingc1} alt="Settings" className="icon-img" />
                <img 
                            src={profile} 
                            alt="User Profile" 
                            className="icon-img profile-toggle" 
                            onClick={toggleRightSidebar} // Toggle Right Sidebar on Click
                />
            </div>
        </div>

        {/* Cards Section */}
        <div className={`cards-container ${isRightSidebarOpen ? "shrink" : "expand"}`}>
            {/* Left Single Card */}
              <div className="left-single-card">
                <h2 className="text">MOU'S Status</h2>
                <div className="left">
                  {cardsData.map((card, index) => (
                    <div key={index} className={`card${index + 1}`}>
                      <span className="card-title">{card.title}</span>
                      <span className="card-symbol">{card.symbol}</span> {/* Symbol added below the title */}
                    </div>
                  ))}
                </div>
              </div>

        
              {/* Right Card */}
              <div className="right-single-card">
              <h2 className="text2">Details </h2>
                <div className="right">
                  <div className="card1">MOU'S</div>
                  <div className="card2">PROJ MOU'S</div>
                  <div className="card3">PROJECTS</div>
                  <div className="card4">OTHER</div>
                </div>
              </div>
        </div>

  <div className="table-wrapper">
    {/* Expiry Overview Card (LEFT) */}
    <div className="expiry-card">
        <h2 className="expiry-title">Expiry Overview</h2>
        <hr />  {/* Line separator */}

        {/* First Table (Single Row) */}
        <table className="expiry-table">
        <thead>
                <tr>
                    <th>Admin Name</th>
                    <th>Expiry Date</th>
                    <th>Time Left</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>XYZ</td>
                    <td>10 Jan 2025</td>
                    <td>2 Days left</td>
                </tr>
            </tbody>
        </table>
        
        <h2 className="expiry-title">Upcoming Expiries</h2>
        <hr /> {/* Line separator */}
        {/* Second Table (Two Rows) */}
        <table className="expiry-table">
        <tr>
                    <th>Admin Name</th>
                    <th>Expiry Date</th>
                    <th>Time Left</th>
        </tr>
            <tbody>
                <tr>
                    <td>XYZ</td>
                    <td>15 Feb 2025</td>
                    <td>3 months left</td>
                </tr>
                <tr>
                    <td>XYZ</td>
                    <td>22 Mar 2025</td>
                    <td>4 months left</td>
                </tr>
            </tbody>
        </table>
        {/* Followup Button */}
        <button className="followup-btn">Followup</button>
    </div>

    {/* Transaction Table Card (RIGHT) */}
    <div className="transaction-card">
        <h3>Pending Review</h3>
        <hr /> {/* Line separator */}
        <label htmlFor="report">Report By: </label>
        <select id="report">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
        </select>
        <hr /> {/* Line separator */}
        <table>
            <thead>
                <tr>
                    <th>Exp ID</th>
                    <th>Admin Name</th>
                    <th>Last-Date</th>
                    <th>Followup-date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((txn, index) => (
                    <tr key={index}>
                        <td>{txn.id}</td>
                        <td>{txn.name}</td>
                        <td>{txn.date}</td>
                        <td>{txn.followup}</td>
                        <td className={txn.status.toLowerCase()}>{txn.status}</td>
                        <td>
                            <button className="view">Reschedule</button>
                            
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  </div>
    {/* New Small Card with Graph */}
    <div class="graphs-wrapper">
        <div className="graph-card">
          <span className="graph-title">Analytics Report</span>
          <img src={bar} alt="bar" className="graph-icon" />
        </div>

        {/* Admin MOUs Table Card (RIGHT) */}
        <div className="admin-mou-card">
            <h3>Admin MOUs</h3>
            <table className="admin-mou-table">
                <thead>
                    <tr>
                        <th>Admin Name</th>
                        <th>MOU Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Admin 1</td>
                        <td>MOU Alpha</td>
                        <td><button className="sign-btn">Sign</button></td>
                    </tr>
                    <tr>
                        <td>Admin 2</td>
                        <td>MOU Beta</td>
                        <td><button className="sign-btn">Sign</button></td>
                    </tr>
                    <tr>
                        <td>Admin 3</td>
                        <td>MOU Lambda</td>
                        <td><button className="sign-btn">Sign</button></td>
                    </tr>
                    <tr>
                        <td>Admin 4</td>
                        <td>MOU zz</td>
                        <td><button className="sign-btn">Sign</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    {/*
    <div className="graph-card2">
              <span className="graph-title2">Analytics Report</span>
                <img src={pie} alt="pie" className="graph-icon2" />
      </div>*/}
    {/* My Applied Scheme Card */}
    <div className="applied-scheme-card">
        <h3>My Applied Scheme</h3>
        <table className="applied-scheme-table">
            <thead>
                <tr>
                    <th>Application firstName</th>
                    <th>Application LastName</th>
                    <th>Application Mail</th>
                    <th>Institute Details</th>
                    <th>Business Details</th>
                    <th>Status</th>
                    <th>View Form</th>
                </tr>
            </thead>
            <tbody>
            {clients.length > 0 ? (
                clients.map((client, index) => (
                <tr key={index}>
                    <td>{client.personalDetails?.firstname || "N/A"}</td>
                    <td>{client.personalDetails?.lastname || "N/A"}</td>
                    <td>{client.personalDetails?.email || "N/A"}</td>
                    <td>{client.instituteDetails?.instituteName || "N/A"}</td>
                    <td>{client.interestDetails?.businessType || "N/A"}</td>
                    <td>{client.interestDetails?.purpose || "N/A"}</td>
                    <td><button 
                          className="view-btn" onClick={() => openModal(client)} // Open the modal on click
                        >View
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="6">No applied schemes found</td>
                </tr>
            )}
            </tbody>
        </table>
    </div>
 </div>
      
      {/* Right Sidebar */}
      {isRightSidebarOpen && (
      <aside className="right-sidebar">
        <div className="user-profile">
          <img src={pro} alt="User" className="profile-img" />
          <h2 className="user-name">Jennifer Bennett</h2>
          <p className="user-role"> Role: Product Designer</p>
        </div>
        <div className="earning-section">
        <h3 className="earning-title">Earning</h3>
      <div className="progress-container">
        <div className="circular-progress">
          <svg viewBox="0 0 100 100">
            <circle className="progress-bg" cx="50" cy="50" r="40"></circle>
            <circle className="progress-bar" cx="50" cy="50" r="40" strokeDasharray="251.2" strokeDashoffset="60"></circle>
            <text x="50" y="55" textAnchor="middle" className="progress-text">$26K</text>
              </svg>
            </div>
          </div>
        </div>
      </aside>
      )}

        {/* Modal for Viewing Client Details */}
{isModalOpen && selectedClient && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Client Details</h2>
        <button className="close-btn" onClick={closeModal}>X</button>
      </div>
      <div className="modal-body">
        {/* Personal Details */}
        <h3 className="section-heading">Personal Details</h3>
        <p><strong>First Name:</strong> {selectedClient.personalDetails?.firstname || "N/A"}</p>
        <p><strong>Last Name:</strong> {selectedClient.personalDetails?.lastname || "N/A"}</p>
        <p><strong>Email:</strong> {selectedClient.personalDetails?.email || "N/A"}</p>
        <p><strong>Contact:</strong> {selectedClient.personalDetails?.contact || "N/A"}</p>
        <p><strong>Role:</strong> {selectedClient.personalDetails?.role || "N/A"}</p>
        <hr />

        {/* Institute Details */}
        <h3 className="section-heading">Institute Details</h3>
        <p><strong>Department Name:</strong> {selectedClient.instituteDetails?.departmentName || "N/A"}</p>
        <p><strong>Institute Name:</strong> {selectedClient.instituteDetails?.instituteName || "N/A"}</p>
        <p><strong>Institute Address:</strong> {selectedClient.instituteDetails?.instituteAddress || "N/A"}</p>
        <p><strong>Pincode:</strong> {selectedClient.instituteDetails?.pincode || "N/A"}</p>
        <hr />

        {/* Interest/Business Details */}
        <h3 className="section-heading">Interest/Business Details</h3>
        <p><strong>Business Type:</strong> {selectedClient.interestDetails?.businessType || "N/A"}</p>
        <p><strong>Purpose:</strong> {selectedClient.interestDetails?.purpose || "N/A"}</p>
        <p><strong>Scope:</strong> {selectedClient.interestDetails?.scope || "N/A"}</p>
        <p><strong>Start Date:</strong> {selectedClient.interestDetails?.startDate ? new Date(selectedClient.interestDetails.startDate).toLocaleDateString() : "N/A"}</p>
        <p><strong>Duration:</strong> {selectedClient.interestDetails?.duration || "N/A"}</p>
        <p><strong>Budget:</strong> {selectedClient.interestDetails?.budget || "N/A"}</p>
        <p><strong>Communication Mode:</strong> {selectedClient.interestDetails?.communicationMode || "N/A"}</p>
        <p><strong>Custom Purpose:</strong> {selectedClient.interestDetails?.customPurpose || "N/A"}</p>
        <hr />
      </div>
      <div className="modal-footer">
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  </div>
)}


   </div>
    
  );
};

export default Dashboard;

