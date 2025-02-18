import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../util';

const LoginPage = () => {
  const [userType, setUserType] = useState('client'); // Default to client
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  // Handle radio button change and reset fields
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setLoginInfo({ email: '', password: '' }); // Reset fields on user type change
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError('Email and password are required');
    }

    try {
      const url = userType === 'admin' ? 'http://localhost:8080/auth/admin' : 'http://localhost:8080/auth/login';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...loginInfo })
      });
      const result = await response.json();
      const { success, message, jwtToken, firstName, lastName, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', `${firstName} ${lastName}`);
        setTimeout(() => {
          navigate(userType === 'client' ? '/mou-signup' : '/Sidebar');
        }, 1000);
      } else if (error) {
        handleError(error.details[0].message);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <main className={styles.loginContainer}>
      <div className={styles.contentWrapper}>
        <section className={styles.leftColumn}>
          <div className={styles.logoWrapper}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5d5f439784fca70648657da8c98e73824d9b7073b0fd70521004ca1dc2006b28?placeholderIfAbsent=true&apiKey=fcbc2de5becc4a58bcd7bfbeb8205e32"
              className={styles.logo}
              alt="Company logo"
            />
          </div>
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeHeading}>Hello, Friends!</h1>
            <p className={styles.welcomeMessage}>
              Fill up your personal information and <br /> start the journey with us
            </p>
            <button className={styles.loginButton}>Log in</button>
          </div>
        </section>

        <section className={styles.rightColumn}>
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <h2 className={styles.loginHeading}>Log in</h2>

            <div className={styles.userTypeSelection}>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="admin"
                  checked={userType === 'admin'}
                  onChange={handleUserTypeChange}
                />
                Admin
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="client"
                  checked={userType === 'client'}
                  onChange={handleUserTypeChange}
                />
                Client
              </label>
            </div>

            <div className={styles.inputField}>
              <p className={styles.fieldHeading}>Email ID</p>
              <label htmlFor="emailInput" className={styles.floatingLabel}></label>
              <input
                name="email"
                onChange={handleChange}
                id="emailInput"
                type="email"
                className={styles.inputLabel}
                required
                placeholder="Email Id "
                value={loginInfo.email}
              />
            </div>

            <div className={styles.inputField}>
              <p className={styles.fieldHeading}>Password</p>
              <label htmlFor="passwordInput" className={styles.floatingLabel}></label>
              <input
                name="password"
                onChange={handleChange}
                id="passwordInput"
                type="password"
                className={styles.inputLabel}
                required
                placeholder="Password "
                value={loginInfo.password}
              />
            </div>

            {userType === 'client' && (
              <>
                <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
                <p className={styles.signUpPrompt}>
                  Don't have an account? <Link to="/signup" className={styles.signUpLink}>Sign up</Link>
                </p>
              </>
            )}

            <button type="submit" className={styles.submitButton}>Log in</button>
          </form>
          <ToastContainer />
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
