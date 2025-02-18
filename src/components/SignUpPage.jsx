import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import styles from './SignUpPage.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'; // Import toast for notifications
import { handleError, handleSuccess } from '../util';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [signupInfo, setSignupInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = signupInfo;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return handleError('All fields are required to be filled');
    }
    try {
        const url = `http://localhost:8080/auth/signup`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupInfo)
        });
        const result = await response.json();
        const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/')
                }, 3000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
          } catch (err) {
              handleError(err);
          }
      }

  return (
    <main className={styles.signUpContainer}>
      <div className={styles.contentWrapper}>
        <section className={styles.leftSection}>
          <div className={styles.leftContent}>
            <img 
              loading="lazy" 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/fc39f102a5295db4dc8fe444332952d008d20116a255f79eb72c3952a83b4410?placeholderIfAbsent=true&apiKey=fcbc2de5becc4a58bcd7bfbeb8205e32" 
              className={styles.logo} 
              alt="Company Logo"
            />
            <div className={styles.welcomeSection}>
              <h1 className={styles.welcomeHeading}>Hello, Friends!</h1>
              <p className={styles.welcomeText}>
                Fill up your personal information and<br />
                start the journey with us
              </p>
              <button className={styles.signUpButton}>Sign up</button>
            </div>
          </div>
        </section>

        <section className={styles.rightSection}>
          <div className={styles.formContainer}>
            <h2 className={styles.formHeading}>Create Account</h2>
            <form onSubmit={handleSignup}>
              <div className={styles.nameFieldsWrapper}>
                <div>
                  <label htmlFor="firstName" className={styles['visually-hidden']}>First Name</label>
                  <input
                    name="firstName"
                    onChange={handleChange}
                    type="text"
                    id="firstName"
                    autoFocus
                    className={styles.inputField}
                    placeholder="First Name"
                    value={signupInfo.firstName}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={styles['visually-hidden']}>Last Name</label>
                  <input
                    name="lastName"
                    onChange={handleChange}
                    type="text"
                    id="lastName"
                    className={styles.inputField}
                    placeholder="Last Name"
                    value={signupInfo.lastName}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className={styles['visually-hidden']}>Email</label>
                <input
                  name="email"
                  onChange={handleChange}
                  type="email"
                  id="email"
                  className={styles.inputField}
                  placeholder="Email id"
                  value={signupInfo.email}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className={styles['visually-hidden']}>Password</label>
                <input
                  name="password"
                  onChange={handleChange}
                  type="password"
                  id="password"
                  className={styles.inputField}
                  placeholder="Password"
                  value={signupInfo.password}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className={styles['visually-hidden']}>Confirm Password</label>
                <input
                  name="confirmPassword"
                  onChange={handleChange}
                  type="password"
                  id="confirmPassword"
                  className={styles.inputField}
                  placeholder="Confirm Password"
                  value={signupInfo.confirmPassword}
                  required
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Create Account
              </button>
            </form>
            <ToastContainer />

            {/* Login Button */}
            <div className={styles.loginPrompt}>
              Already have an account? <Link to="/" className={styles.loginLink}>Log in</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
