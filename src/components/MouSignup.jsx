import React, { useState, useEffect } from "react";
import { StepIndicator } from "./StepIndicator";
import styles from "./MouSignup.module.css";
import accountIcon from "../assets/account.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

const MouSignup = () => {
  const steps = [1, 2, 3];
  const navigate = useNavigate(); // ✅ Corrected useNavigate usage

  const [isCardVisible, setIsCardVisible] = useState(false);
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

  const handleReviewClick = () => {
    navigate("/filldetails");
  };  
  


  return (
    <main className={styles.signupContainer}>
      <header className={styles.header}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/cf5fbaedaa52b356cea389b0d186d4d4d080b453a3e3571251ede55dc47d4fc9?placeholderIfAbsent=true&apiKey=fcbc2de5becc4a58bcd7bfbeb8205e32"
          alt="Company logo"
          className={styles.logo}
        />
       <span className="user-name">{userName}</span>
        <div className={styles.profileIcon} onClick={() => setIsCardVisible(!isCardVisible)}>
          <img loading="lazy" src={accountIcon} alt="" className={styles.iconImage} />
        </div>

        {isCardVisible && (
          <div className={styles.logoutCard}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </header>

      <section className={styles.signupCard}>
        <div className={styles.contentWrapper}>
          <h1 className={styles.title}>Sign a MoU with us</h1>
          <p className={styles.learnMore}>
            Learn More <span className={styles.aboutText}>about MoU.</span>
          </p>
          <div className={styles.stepsContainer}>
            <div className={styles.stepsGrid}>
              {steps.map((step) => (
                <div key={step} className={styles.stepColumn}>
                  <StepIndicator number={step} />
                </div>
              ))}
            </div>
          </div>
          <p className={styles.stepsDescription}>It takes just three steps</p>
          <button className={styles.ctaButton} onClick={handleReviewClick}>
            Get Started
          </button>
        </div>
      </section>

      <ToastContainer />
    </main>
  );
};

export default MouSignup;
