import React from "react";
import styles from './../styles/modules/Footer.module.scss'

function Footer() {
  return (
    <div className={styles.footer}>
      Djib Vanilla is a Djuno Product, COPYRIGHT © 2022 Djuno, All rights
      Reserved.
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14px"
        height="14px"
        viewBox="0 0 32 32"
        style={{ margin: '0 0.5rem' }}
      >
        <path d="M0 0h32v32H0z" fill="#da291c" />
        <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff" />
      </svg>
      Swiss Made
    </div>
  );
}

export default Footer;
