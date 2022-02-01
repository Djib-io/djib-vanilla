import React from "react";
import styles from './../styles/modules/Loading.module.scss'

function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles['loading-dot']}></div>
      <div className={styles['loading-dot']}></div>
      <div className={styles['loading-dot']}></div>
      <div className={styles['loading-dot']}></div>
    </div>
  );
}

export default Loading;
