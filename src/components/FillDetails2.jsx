import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FillDetails2.css";
import logo from '../assets/logo.jpg';
import profile from '../assets/account.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function FillDetails2() {
  const [formData, setFormData] = useState({
    instituteName: "",
    departmentName: "",
    instituteAddress: "",
    pincode: "",
  });



  const [message, setMessage] = useState(""); // To show success/error messages
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      <nav className="navbar">
        <div className="navbar-header">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <div className="navbar-user">
            <span className="user-name">John Doe</span>
            <div className="profile-icon"><img src={profile} alt="" /></div>
          </div>
        </div>
      </nav>

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
