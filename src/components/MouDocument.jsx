import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./MouDocument.css";
import accountIcon from "../assets/account.png";
import "react-datepicker/dist/react-datepicker.css";

const MouDocument = () => {
  const [mouData, setMouData] = useState([]); // Default to an empty array
  const [agreements, setAgreements] = useState({});
  const [reasons, setReasons] = useState({});
  const [formData, setFormData] = useState({});
  const [showReasons, setShowReasons] = useState({});
  const [isCardVisible, setIsCardVisible] = useState(false);
  const navigate = useNavigate();
  

  const [loggedInUser, setLoggedInUser] = useState(null);
      const [userName, setUserName] = useState("Guest");
    
    
    
      useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");
        if (storedUser && storedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(storedUser);
                const fullName = `${parsedUser?.firstName ?? ""} ${parsedUser?.lastName ?? ""}`.trim();
    
                if (fullName) {
                    setUserName(fullName);
                }
    
                // Fetch userId from backend
                fetch(`http://localhost:8080/client/getUserId?firstName=${parsedUser.firstName}&lastName=${parsedUser.lastName}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.userId) {
                            localStorage.setItem("userId", data.userId); // Store in localStorage
                        } else {
                            console.error("User ID not found.");
                        }
                    })
                    .catch(error => console.error("Error fetching user ID:", error));
    
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
    
  const toggleCardVisibility = () => {
    setIsCardVisible((prev) => !prev);
  };

  useEffect(() => {
    console.log("Fetching MoU data...");

    fetch("http://localhost:8080/api/mou")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("MoU Data Fetched:", data);
        setMouData(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching MoU data:", error);
        setMouData([]); // Handle error gracefully
      });
  }, []);

  const handleAgreementChange = (section, isChecked) => {
    setAgreements((prev) => ({ ...prev, [section]: isChecked }));
    if (isChecked) {
      setReasons((prev) => ({ ...prev, [section]: "" })); // Clear reason if agreed
    }
  };

  const handleReasonChange = (section, value) => {
    setReasons((prev) => ({ ...prev, [section]: value }));
  };

  const toggleReason = (section) => {
    setShowReasons((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");

    console.log("🔹 Retrieved userId from localStorage:", userId);

    if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
    }

    const finalData = {
        userId,
        mouData,   // MoU details fetched from MongoDB
        formData,  // User-entered input
    };

    console.log("📝 Submitting MoU Data:", JSON.stringify(finalData, null, 2));

    try {
        console.log("📡 Sending request to API: http://localhost:8080/client/saveMouData");
        
        const response = await fetch("http://localhost:8080/client/saveMouData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(finalData),
        });

        console.log("🔍 Received response:", response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error (Status ${response.status}):`, errorText);
            alert(`Failed to save MoU data: ${errorText}`);
            return;
        }

        const result = await response.json();
        console.log("✅ MoU Data Saved Successfully:", result);
        alert("MoU data saved successfully!");
    } catch (error) {
        console.error("🚨 Error submitting MoU data:", error);
        alert("Error submitting MoU data. Check console for details.");
    }
};

  

 

  const renderTextWithInputs = (text, handleInputChange, formData = {}) => {
    if (!text) return "";
  
    const seenPlaceholders = new Set();
  
    return text.split(/(<[^>]+>)/g).map((part, index) => {
      const match = part.match(/<([^>]+)>/);
      if (match) {
        const placeholder = match[1];
  
        const departmentOptions = ["Computer Science", "Electronics", "Mechanical", "Civil"];
        const isFirstOccurrence = !seenPlaceholders.has(placeholder);
        seenPlaceholders.add(placeholder);
  
        if (placeholder === "Date of effect") {
          return (
            <input
              key={index}
              type="date"
              className="input-field"
              value={formData?.[placeholder] || ""}
              onChange={(e) => handleInputChange(placeholder, e.target.value)}
              disabled={!isFirstOccurrence}
            />
          );
        } else if (placeholder === "Department(s) name") {
          return (
            <select
              key={index}
              className="input-field"
              value={formData?.[placeholder] || ""}
              onChange={(e) => handleInputChange(placeholder, e.target.value)}
              disabled={!isFirstOccurrence}
            >
              <option value="">Select Department</option>
              {departmentOptions.map((dept, i) => (
                <option key={i} value={dept}>{dept}</option>
              ))}
            </select>
          );
        } else {
          return (
            <input
              key={index}
              type="text"
              placeholder={placeholder}
              className="input-field"
              value={formData?.[placeholder] || ""}
              onChange={(e) => handleInputChange(placeholder, e.target.value)}
              disabled={!isFirstOccurrence}
            />
          );
        }
      }
      return part;
    });
  };
 
  
  return (
    <>
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

      <div className="mou-container">
        <h1 className="mou-header">MoU Agreement Form</h1>

        {mouData.length > 0 ? (
          <div className="mou-cards">
            {mouData.map((document, docIndex) => (
              <div key={docIndex} className="mou-document">
                <h2 className="document-title">{document.title}</h2>

                {Array.isArray(document.content) && document.content.length > 0 ? (
                  document.content.map((section, index) => (
                    <div key={index} className="mou-card">
                      <div className="section-number">{index + 1}.</div>
                      <div className="section-content">
                        <h2 className="section-heading">{section.section}</h2>
                        <p className="section-text">{renderTextWithInputs(section.text,handleInputChange, formData)}</p>
                      

                        {Array.isArray(section.clauses) && section.clauses.length > 0 &&
                          section.clauses.map((clause, idx) => (
                            <p key={idx} className="clause-text">
                              {renderTextWithInputs(clause.text,handleInputChange, formData)}
                            </p>
                          ))
                        }

                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={agreements[section.section] || false}
                            onChange={(e) => handleAgreementChange(section.section, e.target.checked)}
                          />
                          I agree to the above terms and conditions.
                        </label>

                        {!agreements[section.section] && (
                          <div className="reason-container">
                            <button className="reason-toggle" onClick={() => toggleReason(section.section)}>
                              {showReasons[section.section] ? "Hide Reason" : "Provide Reason"}
                            </button>
                            {showReasons[section.section] && (
                              <textarea
                                placeholder="Explain your reason..."
                                className="reason-input"
                                value={reasons[section.section] || ""}
                                onChange={(e) => handleReasonChange(section.section, e.target.value)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No content available for this document.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Loading MoU details...</p>
        )}

        <button className="submit-button" onClick={handleSubmit}>Submit Form</button>

      </div>
    </>
  );
};

export default MouDocument;

