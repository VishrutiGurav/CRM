import React, { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import styles from './MouSignup.module.css';
import accountIcon from '../assets/account.png';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../util';
import { ToastContainer } from 'react-toastify';

const MouSignup = () => {
  const steps = [1, 2, 3];
  const loggedInUser = localStorage.getItem('loggedInUser') || 'User';
  const [isCardVisible, setCardVisible] = useState(false); // State to manage card visibility
  const navigate = useNavigate();

  const toggleCardVisibility = () => {
    setCardVisible(!isCardVisible);
  };

  const handleReviewClick = () => {
    navigate("/filldetails"); // Replace with your actual route
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    handleSuccess('Logged out successfully!');
    navigate('/'); // Redirect to login page
  };
  console.log("MouSignup component rendered.");


  return (
    <main className={styles.signupContainer}>
      <header className={styles.header}>
        <img 
          loading="lazy" 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/cf5fbaedaa52b356cea389b0d186d4d4d080b453a3e3571251ede55dc47d4fc9?placeholderIfAbsent=true&apiKey=fcbc2de5becc4a58bcd7bfbeb8205e32" 
          alt="Company logo" 
          className={styles.logo} 
        />
        <span className={styles.userName}>{loggedInUser}</span>

        {/* Circular icon next to the user name */}
        <div className={styles.profileIcon} onClick={toggleCardVisibility}>
          <img 
            loading="lazy"
            src={accountIcon}
            alt=""
            className={styles.iconImage}
          />
        </div>

        {/* Logout Card */}
        {isCardVisible && (
          <div className={styles.logoutCard}>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
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
              {steps.map(step => (
                <div key={step} className={styles.stepColumn}>
                  <StepIndicator number={step} />
                </div>
              ))}
            </div>
          </div>
          <p className={styles.stepsDescription}>It takes just three steps</p>
          <button className={styles.ctaButton} onClick={handleReviewClick}>Get Started</button>
        </div>
      </section>

      <ToastContainer />
    </main>
  );
};

export default MouSignup;
