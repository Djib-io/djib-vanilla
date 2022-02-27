import classNames from "classnames";
import React from "react";
import styles from "./../styles/modules/Header.module.scss";

function Header() {
  return (
    <div className={classNames("container", styles.container)}>
      <div className={styles.headerBc}>
        <span />
        <span />
      </div>
      <div className={styles.header}>
        <p>Upload file to Djib</p>
        <div>
          Djib-vanilla is a lightweight, secure, and carbon-neutral web3.0 app to
          store and share files on the Djib network, powered by Solana
        </div>
      </div>
    </div>
  );
}

export default Header;
