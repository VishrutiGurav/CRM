import React, { useState, useEffect } from "react";
import "./MouDocument.css";

const MouDocument = () => {
  const [mouData, setMouData] = useState(null); // Initially set to null
  const [agreements, setAgreements] = useState({});
  const [reasons, setReasons] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [formData, setFormData] = useState({});
  const [showReasons, setShowReasons] = useState({});

  useEffect(() => {
    console.log("Fetching MoU data...");

    fetch("http://localhost:8080/api/mou") // Ensure this route exists in your backend
      .then((response) => {
        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("MoU Data Fetched:", data);
        if (Array.isArray(data)) {
          setMouData(data); // Store all documents properly
        } else {
          setMouData([]); // Ensure it is an empty array instead of undefined
        }
      })
      .catch((error) => {
        console.error("Error fetching MoU data:", error);
        setMouData([]); // Set an empty array on error
      });
  }, []);

  const handleAgreementChange = (section, isChecked) => {
    console.log(`Agreement changed for ${section}: ${isChecked}`);
    setAgreements((prev) => ({ ...prev, [section]: isChecked }));
    if (isChecked) {
      setReasons((prev) => ({ ...prev, [section]: "" })); // Clear reason if agreed
    }
  };

  const handleReasonChange = (section, value) => {
    console.log(`Reason updated for ${section}: ${value}`);
    setReasons((prev) => ({ ...prev, [section]: value }));
  };

  // Toggle function to expand/collapse reason input
  const toggleReason = (section) => {
    setShowReasons((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to replace placeholders with input fields
  const renderTextWithInputs = (text) => {
    if (!text) return ""; // Handle null or undefined text safely

    return text.split(/(<[^>]+>)/g).map((part, index) => {
      const match = part.match(/<([^>]+)>/); // Extract placeholder text
      if (match) {
        return (
          <input
            key={index}
            type="text"
            placeholder={match[1]}
            className="input-field"
            onChange={(e) => handleInputChange(match[1], e.target.value)}
          />
        );
      }
      return part; // Keep normal text as it is
    });
  };

  return (
    <div className="mou-container">
      <h1 className="mou-header">MoU Agreement Form</h1>

      {mouData && mouData.length > 0 ? (
        <div className="mou-cards">
          {mouData.map((document, docIndex) => (
            <div key={docIndex} className="mou-document">
              <h2 className="document-title">{document.title}</h2>

              {Array.isArray(document.content) && document.content.length > 0 ? (
                document.content.map((section, index) => (
                  <div key={index} className="mou-card">
                    {/* Serial Number */}
                    <div className="section-number">{index + 1}.</div>

                    {/* Section Content */}
                    <div className="section-content">
                      <h2 className="section-heading">{section.section}</h2>
                      <p className="section-text">{renderTextWithInputs(section.text)}</p>

                      {Array.isArray(section.clauses) && section.clauses.length > 0 &&
                        section.clauses.map((clause, idx) => (
                          <p key={idx} className="clause-text">
                            {renderTextWithInputs(clause.text)}
                          </p>
                        ))
                      }

                      {/* Agreement Checkbox */}
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={agreements[section.section] || false}
                          onChange={(e) => handleAgreementChange(section.section, e.target.checked)}
                        />
                        I agree to the above terms and conditions.
                      </label>

                      {/* Reason Input if Disagreed */}
                      {!agreements[section.section] && (
                        <div className="reason-container">
                          <button
                            className="reason-toggle"
                            onClick={() => toggleReason(section.section)}
                          >
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
    </div>
  );
};
export default MouDocument;

