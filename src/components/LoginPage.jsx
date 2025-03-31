import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";  // ✅ Import Axios
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../util";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
    const [userType, setUserType] = useState("client"); // Default to client
    const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    // Handle radio button change and reset fields
    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
        setLoginInfo({ email: "", password: "" }); // Reset fields on user type change
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError("Email and password are required");
        }

        try {
            const url =
                userType === "admin"
                    ? "http://localhost:8080/auth/admin"
                    : "http://localhost:8080/auth/login";

            const response = await axios.post(url, loginInfo, {
                withCredentials: true,  // ✅ Ensures cookies are sent & received
            });

            const { success, message, jwtToken, firstName, lastName } = response.data;

            if (success) {
                handleSuccess(message);

                // ✅ Store token in Cookies (for Client Only)
                if (userType === "client") {
                    Cookies.set("token", jwtToken, { expires: 1, secure: true, sameSite: "Strict" });
                }
                localStorage.setItem("loggedInUser", JSON.stringify({ firstName, lastName }));

                // ✅ Redirect based on userType
                setTimeout(() => {
                    navigate(userType === "client" ? "/mou-signup" : "/admindashboard");
                }, 1000);
            } else {
                handleError(message);
            }
        } catch (err) {
          console.error("Error Response:", err.response?.data || err.message); // Debugging
          handleError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
                                    checked={userType === "admin"}
                                    onChange={handleUserTypeChange}
                                />
                                Admin
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="userType"
                                    value="client"
                                    checked={userType === "client"}
                                    onChange={handleUserTypeChange}
                                />
                                Client
                            </label>
                        </div>

                        <div className={styles.inputField}>
                            <p className={styles.fieldHeading}>Email ID</p>
                            <input
                                name="email"
                                onChange={handleChange}
                                type="email"
                                className={styles.inputLabel}
                                required
                                placeholder="Email Id "
                                value={loginInfo.email}
                            />
                        </div>

                        <div className={styles.inputField}>
                            <p className={styles.fieldHeading}>Password</p>
                            <input
                                name="password"
                                onChange={handleChange}
                                type="password"
                                className={styles.inputLabel}
                                required
                                placeholder="Password "
                                value={loginInfo.password}
                            />
                        </div>

                        {userType === "client" && (
                            <>
                                <a href="#" className={styles.forgotPassword}>
                                    Forgot Password?
                                </a>
                                <p className={styles.signUpPrompt}>
                                    Don't have an account?{" "}
                                    <Link to="/signup" className={styles.signUpLink}>
                                        Sign up
                                    </Link>
                                </p>
                            </>
                        )}

                        <button type="submit" className={styles.submitButton}>
                            Log in
                        </button>
                    </form>
                    <ToastContainer />
                </section>
            </div>
        </main>
    );
};

export default LoginPage;
