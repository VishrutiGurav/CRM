import React from 'react';
import styles from './SidebarItem.module.css';

function SidebarItem({ icon, label, additionalIcon }) {
  return (
    <div className={styles.sidebarItem}>
      <img src={icon} alt="" className={styles.icon} />
      <span className={styles.label}>{label}</span>
      {additionalIcon && <img src={additionalIcon} alt="" className={styles.additionalIcon} />}
    </div>
  );
}

export default SidebarItem;