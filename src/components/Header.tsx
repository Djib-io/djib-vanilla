import classNames from "classnames";
import React from "react";
import styles from "./../styles/modules/Header.module.scss";
import Breadcrumb from "./Breadcrumb";

function Header() {
  return (
    <div className={classNames(styles.container)}>
      <div className={styles.headerBc}>
        <span />
        <span />
      </div>
      <div className={styles.header}>
        <p>Djib Vanilla</p>
        <div>
          Djib-Vanilla is a lightweight, secure, and carbon-neutral web3.0 app
          to store and share files on the Djib network. With Djib Vanilla, you
          can upload and share files permanently and mint NFTs on Solana with
          no coding skill required.
        </div>
        
        <Breadcrumb />
      </div>

    </div>
  );
}

export default Header;
