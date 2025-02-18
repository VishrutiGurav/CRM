import React, { useState , useEffect} from "react";
import { Link } from "react-router-dom"; 
import styles from "./Sidebar.module.css";
import logo from '../assets/logo.jpg';
import dashboard from "../assets/dashboard.png";
import mou from "../assets/mou-mgt.png";
import application from "../assets/application.png";
import setting from "../assets/setting.png";
import logout from "../assets/logout.png";
import reports from "../assets/reports.png";
import mous from "../assets/mou.png";
import closeIcon from "../assets/close-icon.png";
import openIcon from "../assets/open-icon.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMouOpen, setIsMouOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    
  };

  const toggleMouDropdown = () => {
    setIsMouOpen(!isMouOpen);
   
  };

  


  return (
    <div className={styles.sidebarContainer}>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.partial}`}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" className={styles.logoImage} />
        </div>

        <img
          src={isOpen ? closeIcon : openIcon}
          alt="Toggle Icon"
          className={styles.toggleIcon}
          onClick={toggleSidebar}
        />

        <ul className={styles.sidebarItems}>
          <li className={styles.sidebarItem}>
            <img src={dashboard} alt="Dashboard" className={styles.icon} />
            {isOpen && "Dashboard"}
          </li>
          <li
            className={`${styles.sidebarItem} ${isMouOpen ? styles.mouOpen : ""}`}
            onClick={toggleMouDropdown}
          >
            <img src={mou} alt="Mou Management" className={styles.icon} />
            {isOpen && "Mou Management"}
            {isOpen && isMouOpen && (
              <ul className={styles.dropdown}>
                <li className={styles.dropdownItem}>
                  <img src={application} alt="Application" className={styles.icon} />Application
                </li>
                <li className={styles.dropdownItem}>
                  <img src={mous} alt="mous" className={styles.icon} />Mou
                </li>
                <li className={styles.dropdownItem}>
                  <img src={reports} alt="Report" className={styles.icon} />Report
                </li>
              </ul>
            )}
          </li>
          <li className={styles.sidebarItem}>
            <img src={setting} alt="Settings" className={styles.icon} />
            {isOpen && "Settings"}
          </li>
          <li className={styles.sidebarItem}>
            <img src={logout} alt="Logout" className={styles.icon} />
            {isOpen && "Logout"}
          </li>
          <li className={styles.sidebarItem}>
          <Link to="/Application" className={styles.link} onClick={() => console.log("Navigating to Application page.")}>
            <img src={setting} alt="Settings" className={styles.icon} />
            {isOpen && "Application"}
            </Link>
          </li>
          <li className={styles.sidebarItem}>
            <img src={logout} alt="Logout" className={styles.icon} />
            {isOpen && "Mou"}
          </li>
        </ul>
      </div>

      
    </div>
  );
};

export default Sidebar;
