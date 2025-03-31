import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FillDetails2.css";
import logo from '../assets/logo.jpg';
import profile from '../assets/account.png';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import accountIcon from "../assets/account.png"; // Import useNavigate

function FillDetails2() {
   const [isCardVisible, setIsCardVisible] = useState(false);
  const [formData, setFormData] = useState({
    instituteName: "",
    departmentName: "",
    instituteAddress: "",
    pincode: "",
  });



  const [message, setMessage] = useState(""); // To show success/error messages
  const navigate = useNavigate(); // Initialize useNavigate hook

    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userName, setUserName] = useState("Guest");
  
  
  
    useEffect(() => {
      const storedUser = localStorage.getItem("loggedInUser");
      if (storedUser && storedUser !== "undefined") {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Parsed User:", parsedUser);
    
          setLoggedInUser(parsedUser);
    
          // Ensure names are not null/undefined
          const fullName = `${parsedUser?.firstName ?? ""} ${parsedUser?.lastName ?? ""}`.trim();
          if (fullName) {
            setUserName(fullName);
          }
    
          console.log("Updated userName:", fullName);
        } catch (error) {
          console.error("Error parsing logged-in user data:", error);
        }
      }
    }, []);
    
  
  
    const handleLogout = () => {
      Cookies.remove("token");
      localStorage.removeItem("loggedInUser");
      setLoggedInUser(null);
      navigate("/");
    };
  
  
  
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
      const toggleCardVisibility = () => {
        setIsCardVisible((prev) => !prev);
      };

 



  const personalData = JSON.parse(localStorage.getItem("personalData"));
    
   

  useEffect(() => {
    
    if (!personalData) {
      navigate("/filldetails"); // Redirect if personal data is not available
      return;
    }
  
    // Load saved data only once
    const savedData = JSON.parse(localStorage.getItem("instituteDetails"));
    if (savedData) {
      setFormData(savedData);
    }
  }, []); 
    


      const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form from refreshing the page
      
        try {
          localStorage.setItem("instituteDetails", JSON.stringify(formData));

           // Log the stored data to the console
           console.log("Saved Institute Details:", JSON.parse(localStorage.getItem("instituteDetails")));

          setMessage("Personal details saved successfully!");
          
      
          setFormData({
            instituteName: "",
            departmentName: "",
            instituteAddress: "",
            pincode: "",
          });
        
          navigate("/filldetails3");
        } catch (error) {
          setMessage("Error saving details. Please try again.");
          console.error(error);
        }
      };
      

  return (
    <div className="fill-details2-container">
      <header className="header">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/cf5fbaedaa52b356cea389b0d186d4d4d080b453a3e3571251ede55dc47d4fc9"
                alt="Company logo"
                className="logo"
              />
              <span className="user-name">{userName}</span>

      
              <div className="profile-icon" onClick={toggleCardVisibility}>
                <img loading="lazy" src={accountIcon} alt="Profile" className="icon-image" />
              </div>
      
              {isCardVisible && (
                <div className="logout-card">
                  <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
              )}
            </header>

      <div className="content">
        <h1 className="main-heading">Fill the Institute Details</h1>
        
        <div className="step-indicator">
          <div className="step">
            <div className="circle">1</div>
            <p>Personal Details</p>
          </div>
          <div className="dotted-line"></div>
          <div className="step1">
            <div className="circle1">2</div>
            <p>Institute Details</p>
          </div>
          <div className="dotted-line"></div>
          <div className="step">
            <div className="circle1">3</div>
            <p style={{ color: "grey" }}>Interest Details</p>
          </div>
        </div>

        <div className="form-box">
          <h2 className="form-heading">Institute Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-container">
              <div className="form-column">
                <div className="form-group">
                  <label>Institute Name</label>
                  <input type="text" name="instituteName" value={formData.instituteName}
                    onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" name="departmentName" value={formData.departmentName}
                    onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div className="form-column">
                <div className="form-group">
                  <label>Institute Address</label>
                  <input type="text" name="instituteAddress" value={formData.instituteAddress}
                    onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode}
                    onChange={handleChange} className="form-input" />
                </div>
              </div>

                
                <div className="form-group">
                  <button type="submit" className="form-button">Save</button>
                </div>
            </div>
          </form>
          {message && <p className="feedback-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default FillDetails2;
