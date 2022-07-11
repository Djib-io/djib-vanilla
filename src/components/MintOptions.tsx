import React from "react";
import styles from "./../styles/modules/Actions.module.scss";
import { ReactComponent as MintOneIcon } from "./../assets/icons/mint-one.svg";
import { ReactComponent as CollectionIcon } from "./../assets/icons/collection.svg";
import { useBoxDispatch } from "../providers/BoxBrowser";

function MintOptions() {
  const { navigate } = useBoxDispatch();

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <p>Which one?</p>
      </div>
      <ul>
        <li onClick={() => navigate("mint-one-upload")}>
          <MintOneIcon />
          <p>Mint 1</p>
        </li>
        <li>
          <CollectionIcon />
          <p>Mint a collection</p>
        </li>
      </ul>
    </div>
  );
}

export default MintOptions;
