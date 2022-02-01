import React, {useEffect} from "react";
import styles from "./../styles/modules/Box.module.scss";
import {useBoxDispatch} from "../providers/BoxBrowser";

export type BoxesProps = {
  children: React.ReactElement | React.ReactElement[];
  forceChangePath?: string
};

function Boxes({ children, forceChangePath }: BoxesProps) {
  const {navigate} = useBoxDispatch()

  useEffect(() => {
    if(forceChangePath){
      navigate(forceChangePath)
    }
  }, [forceChangePath, navigate])

  return (
    <div className={styles.container}>
          {children}
    </div>
  );
}

export default Boxes;
