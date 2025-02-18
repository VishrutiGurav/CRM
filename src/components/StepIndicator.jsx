import React from 'react';
import styles from './StepIndicator.module.css';

export const StepIndicator = ({ number }) => (
  <div className={styles.stepCircle}>
    {number}
  </div>
);