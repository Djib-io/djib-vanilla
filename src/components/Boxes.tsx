import React from "react";
import styles from "./../styles/modules/Box.module.scss";

export type BoxesProps = {
  children: React.ReactElement | React.ReactElement[];
};

function Boxes({ children }: BoxesProps) {


  return (
    <div className={styles.container}>
          {children}
    </div>
  );
}

export default Boxes;
