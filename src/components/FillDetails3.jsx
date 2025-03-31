import React, { useState , useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./FillDetails3.css";
import Cookies from "js-cookie";
import accountIcon from "../assets/account.png";


const FillDetails3 = () => {

  const navigate = useNavigate();
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [formData, setFormData] = useState({
    businessType: "",
    purpose: "Partnership",
    scope: "",
    startDate: "",
    duration: "",
    budget: "",
    communicationMode: "",
    customPurpose: "",
  });

  // Business options array
  const businessOptions = ["IT", "Healthcare", "Finance", "Education", "Other"];

  // Purpose of MoU options
  const purposeOptions = [
    "Partnership",
    "Collaboration",
    "Supplier Agreement",
    "Other",
  ];

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

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        // First, fetch the user details from the backend
        const userNameParts = userName.split(" "); // Assuming "Vishruti Gurav"
        const firstName = userNameParts[0];
        const lastName = userNameParts.slice(1).join(" ");
    
        const userResponse = await axios.get("http://localhost:8080/client/getUserId", {
          params: { firstName, lastName },
        });
    
        const userId = userResponse.data.userId;
    
        if (!userId) {
          alert("User not found. Please try again.");
          return;
        }
    
        // Get stored personal and institute details
        const personalDetails = JSON.parse(localStorage.getItem("personalData"));
        const instituteDetails = JSON.parse(localStorage.getItem("instituteDetails"));
    
        if (!personalDetails || !instituteDetails) {
          alert("Missing details. Please start again.");
          navigate("/filldetails");
          return;
        }
    
        // Prepare final data
        const finalData = {
          userId, // Attach retrieved user ObjectId
          personalDetails,
          instituteDetails,
          interestDetails: formData,
        };
    
        console.log("Final data to be sent:", finalData);
    
        // Send the data to backend
        await axios.post("http://localhost:8080/client/saveDetails", finalData);
        alert("Details submitted successfully!");
    
        // Clear localStorage
        localStorage.removeItem("personalData");
        localStorage.removeItem("instituteDetails");
    
        navigate("/success"); // Redirect to success page
      } catch (error) {
        console.error("Error submitting details:", error);
        alert("Error submitting details. Please try again.");
      }
    };
    
  return (
    <div className="fill-details-container">
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
        <h1 className="main-heading">Fill the details to sign a MoU with us</h1>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="step">
            <div className="circle">✔</div>
            <p>Personal Details</p>
          </div>
          <div className="dotted-line"></div>
          <div className="step">
            <div className="circle">✔</div>
            <p>Institute Details</p>
          </div>
          <div className="dotted-line"></div>
          <div className="step1">
            <div className="circle1">3</div>
            <p>Interest Details</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-box">
          <h2 className="form-heading">Business/Project Details</h2>
          <form onSubmit={handleSubmit}>
          <div className="form-container">
            {/* Business Type - Inline Buttons */}
            <div className="form-row">
              <label>Business Type / Industry</label>
              <div className="business-type-options">
                {businessOptions.map((type) => (
                  <button
                    key={type}
                    className={`option-button ${
                      formData.businessType === type ? "selected" : ""
                    }`}
                    onClick={() => setFormData({ ...formData, businessType: type })}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Start Date & Duration - Inline */}
            <div className="form-row">
              <div className="form-column">
                <label>Preferred Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div className="form-column">
                <label>Duration of MoU</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Duration</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                </select>
              </div>
            </div>

            {/* Budget & Mode of Communication - Inline */}
            <div className="form-row">
              <div className="form-column">
                <label>Estimated Budget</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter estimated budget"
                />
              </div>
              <div className="form-column">
                <label>Preferred Mode of Communication</label>
                <div className="communication-mode-options">
                  <label>
                    <input
                      type="radio"
                      name="communicationMode"
                      value="Email"
                      onChange={handleChange}
                    />
                    Email
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="communicationMode"
                      value="Phone"
                      onChange={handleChange}
                    />
                    Phone
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="communicationMode"
                      value="Video Conference"
                      onChange={handleChange}
                    />
                    Video Conference
                  </label>
                </div>
              </div>
            </div>

            {/* Purpose of MoU */}
            <div className="form-row">
              <label>Purpose of MoU</label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="input-field"
              >
                {purposeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value="Other">Other (Please specify)</option>
              </select>
              {formData.purpose === "Other" && (
                <input
                  type="text"
                  name="customPurpose"
                  value={formData.customPurpose}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Please specify the purpose"
                />
              )}
            </div>

            {/* Expected Scope of Work */}
            <div className="form-row">
              <label>Expected Scope of Work</label>
              <textarea
                name="scope"
                value={formData.scope}
                onChange={handleChange}
                className="input-field"
                required
                placeholder="Briefly describe the involvement of both parties..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <button className="form-button">Submit</button>
          </div>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default FillDetails3;



