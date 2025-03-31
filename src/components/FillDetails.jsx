import React, { useState , useEffect} from "react";
import "./FillDetails.css";
import Cookies from "js-cookie";
import logo from '../assets/logo.jpg';
import accountIcon from "../assets/account.png";
import { useNavigate } from 'react-router-dom'; 

function FillDetails() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    role: "",
  });

  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false); // Track email verification
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes timer
  const [canResend, setCanResend] = useState(false); // Track if resend is allowed

  const navigate = useNavigate(); 



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


  const handleVerifyEmail = async () => {
    const email = formData.email.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      setMessage("Email field cannot be empty.");
      setEmailError(true);
      return;
    }

    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email address.");
      setEmailError(true);
      return;
    }

    setEmailError(false);
    setMessage("Checking email...");

    try {
      const checkResponse = await fetch(
        `http://localhost:8080/client/checkEmail?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!checkResponse.ok) {
        throw new Error("Failed to fetch email details.");
      }

      const data = await checkResponse.json();
      console.log("Backend Response Data:", data);

      if (data.exists) {
        setEmailError(true);
        setMessage("Email already registered. Please use a different email.");
        console.log("Email already exists in the backend");
        setEmailVerified(false);
        return;
      }
       // If email does not exist, proceed to send OTP
       const otpResponse = await fetch(
        "http://localhost:8080/client/sendOtp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
  
      if (!otpResponse.ok) {
        throw new Error("Failed to send OTP.");
      }
  
      setMessage("OTP sent successfully. Please check your email.");
      console.log("OTP Sent Successfully.");
      // Show OTP modal and start the countdown
      setShowOtpModal(true);
      setOtpTimer(300); // Reset timer to 5 minutes
      setCanResend(false);

    } catch (error) {
      setMessage("Error verifying email. Please try again.");
      console.error(error);
    }
  };

   // Handle OTP timer countdown
   useEffect(() => {
    if (showOtpModal && otpTimer > 0) {
      const timer = setInterval(() => {
        setOtpTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
  }, [otpTimer, showOtpModal]);

  const handleResendOtp = async () => {
    setOtpTimer(300); // Reset timer to 5 minutes
    setCanResend(false);
    handleVerifyEmail(); // Resend OTP
  };

  const handleSubmitOtp = async () => {
    console.log("Submitting OTP...");
    console.log("Email:", formData.email);
    console.log("Entered OTP:", otp);
    try {
      const response = await fetch("http://localhost:8080/client/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await response.json();
      console.log("Server Response:", data); // Log the entire response

      if (response.ok) {
        setEmailVerified(true);
        setShowOtpModal(false);
        setMessage(data.message || "Email verified successfully!");
        console.log("OTP verified successfully.");
      } else {
        setMessage(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage("Error verifying OTP. Please try again.");
      console.error("Error during OTP verification:", error);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
  
    if (!emailVerified) {
      setMessage("Please verify your email before proceeding.");
      return;
    }
  
    try {
      localStorage.setItem("personalData", JSON.stringify(formData));
      // Log the stored data to the console
      console.log("Saved personal Details:", JSON.parse(localStorage.getItem("personalData")));
      setMessage("Personal details saved successfully!");
  
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        contact: "",
        role: "",
      });
  
      navigate("/filldetails2");
    } catch (error) {
      setMessage("Error saving details. Please try again.");
      console.error(error);
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

        <div className="step-indicator">
          <div className="step1">
            <div className="circle">1</div>
            <p>Personal Details</p>
          </div>
          <div className="dotted-line"></div>
          <div className="step">
            <div className="circle1">2</div>
            <p style={{ color: "grey" }}>Institute Details</p>
          </div>
          <div className="dotted-line"></div>
          <div className="step">
            <div className="circle1">3</div>
            <p style={{ color: "grey" }}>Interest Details</p>
          </div>
        </div>

        <div className="form-box">
          <h2 className="form-heading">Personal Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-container">
              <div className="form-column">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="firstname" value={formData.firstname}
                    onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastname" value={formData.lastname}
                    onChange={handleChange} className="form-input" required />
                </div>
              </div>

              <div className="form-column">
                <div className="form-group">
                  <label>Email ID</label>
                  <div className="input-wrapper">
                    <input type="text" name="email" value={formData.email}
                      onChange={handleChange} className={`form-input ${emailError ? 'error' : ''}`} required />
                     <button
  type="button"
  className={`verify-button ${emailVerified ? 'verified' : ''}`}
  onClick={handleVerifyEmail}
  disabled={emailVerified}
>
  {emailVerified ? "Verified" : "Verify"}
</button>

                  </div>
                </div>
                <div className="form-group">
                  <label>Contact No</label>
                  <input type="tel" name="contact" value={formData.contact}
                    onChange={handleChange} className="form-input" required />
                </div>
              </div>

              <div className="form-column">
                <div className="form-group">
                  <label>Role at Institute</label>
                  <input type="text" name="role" value={formData.role}
                    onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <button type="submit" className="form-button">Save</button>
                </div>
              </div>
            </div>
          </form>
          {message && <p className="feedback-message">{message}</p>}
        </div>
        {showOtpModal && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <h3>OTP Sent</h3>
            <p>OTP is valid for <strong>5 minutes</strong>.</p>
            <p>Time remaining: <span className="timer">{Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, "0")}</span></p>
            <input type="text" placeholder="Enter OTP" className="otp-input" value={otp} onChange={(e) => setOtp(e.target.value)}/>
            <div className="otp-buttons">
              <button onClick={handleSubmitOtp} className="submit-otp">Submit</button>
              <button onClick={handleResendOtp} className="resend-otp" disabled={!canResend}>
                Resend OTP
              </button>
              </div>
            <button onClick={() => setShowOtpModal(false)} className="close-modal">Close</button>
          </div>
      </div>
        )}
    </div>
    </div>
  );
} 

export default FillDetails;

