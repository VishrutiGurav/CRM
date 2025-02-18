// Application.jsx
//import React from "react";
import styles from "./Sidebar.module.css";
import account from "../assets/account.png"
import search from "../assets/search.png"
import React, { useState, useEffect } from 'react';
import Layout from "./Layout";
import "./Application2.css";
import axios from 'axios'; // Import the CSS file

const Application2 = ({ isOpen }) => {

    console.log("isOpen in Application.jsx:", isOpen); // Log state here
    const [searchTerm, setSearchTerm] = useState('');
    const [tableData, setTableData] = useState([]); // State to store fetched data
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State for dropdown visibility
    const [isWatched, setIsWatched] = useState(false); // State for watched status

    const cardData = [
      { title: 'Pending Applications', percentage: '00.00%', color: 'yellow', text:'Last Updated last week ago', count: 2 },
      { title: 'Approved Applications', percentage: '00.00%', color: 'green', text:'Last Updated last week ago', count: 10 },
      { title: 'Rejected Applications', percentage: '00.00%', color: 'red', text:'Last Updated last week ago', count: 6 },
      { title: 'Hold Applications', percentage: '00.00%', color: 'orange', text:'Last Updated last week ago', count: 4 }
    ];
  
    // Fetch data from the API when the component mounts
    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get("http://localhost:8080/client/getDetails");
              const fetchedData = response.data;

              // Map the fetched data into the table structure you want
              const mappedData = fetchedData.map((item, index) => ({
                  date: new Date().toLocaleDateString(), // Placeholder for date
                  name: `${item.personalDetails.firstname} ${item.personalDetails.lastname}`,
                  institute: item.instituteDetails.instituteName,
                  position: item.personalDetails.role,
                  status: 'Pending',
                  action: 'View',
                  app: '👁️'
              }));

              setTableData(mappedData); // Set the fetched and mapped data
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      };

      fetchData();
  }, []); // Empty dependency array to run only once after component mounts

  // Handle the click for dropdown visibility
  const handleAction2Click = () => {
      setIsDropdownVisible(!isDropdownVisible);
  };

  // Handle the click for watched status
  const handleAction1Click = () => {
      setIsWatched(!isWatched);
  };

    
  
  return (
    <Layout isOpen={isOpen}>
      <div className={`content ${isOpen ? 'content-shifted' : 'content-full'}`}>
      <div className="scrollable-container">
      
      <header>
        <div className="head">
        <h1>Applications</h1>
        <div className="user-profile">
          <span className="usernametxt">User Name</span>
          <img src={account} alt="Account" className={styles.icon} style={{ width: '70px', height: '60px' }}/>
        </div>
        </div>                 

        <div className="search-bar-container">
        <input className="search-bar" placeholder="Search here..." />
        <img className="search-icon" src={search} alt="Search Icon" />  
          <select className="date-dropdown">
            <option value="all">Dates</option>        
            <option>1st Jan 2025</option>
            <option>2nd Jan 2025</option>
            <option>3rd Jan 2025</option>
            <option value="today">Today</option>
            <option value="today">Tomorrow</option>
            {/* Other date options */}
          </select>        
        </div>
      </header>
      <hr></hr>
      <div className="cards-container">
        {cardData.map((card) => (
          <div className="card" key={card.title}>
            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <p className="percentage">{card.percentage}%</p>
              <p className="text">{card.text}</p>
              <div></div>
              <div className="style">
              <button className="but">Proceed to Sign</button>
              <span className="count">{card.count}</span>
              </div>
            </div>
          </div>
        ))}
      
        {/* Your four cards here */}
      </div>
      <hr></hr>
      <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Institute</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                    <th>Application</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.filter((item) =>
                                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.date}</td>
                                        <td>{item.name}</td>
                                        <td>{item.institute}</td>
                                        <td>{item.position}</td>
                                        <td>
                                            <button className="status-button">{item.status}</button>
                                        </td>
                                        <td>
                                            <button className="action-button" onClick={handleAction2Click}>
                                                {item.action} {isDropdownVisible ? '▲' : '▼'}
                                            </button>
                                            {isDropdownVisible && (
                                                <div className="dropdown-content">
                                                    <a href="#">Option 1</a><br />
                                                    <a href="#">Option 2</a><br />
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <button className={`application-button ${isWatched ? 'watched-state' : ''}`} onClick={handleAction1Click}>
                                                {isWatched ? 'watched' : item.app}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Application2;


