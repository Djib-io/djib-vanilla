import React from "react";
import { useBox } from "../providers/BoxBrowser";
import { useTransition, animated } from "@react-spring/web";
import styles from "./../styles/modules/Box.module.scss";

export type BoxProps = {
  path: string;
  element: React.ReactElement;
};

function Box({ path, element }: BoxProps) {
  const { path: currentPath } = useBox();

  const transitions = useTransition(path === currentPath, {
    from: { opacity: 0, scale: 0.4 },
    enter: { opacity: 1, scale: 1, x: 0 },
    leave: { opacity: 0, scale: 0.4 },
    delay: 0,
    config: {
      tension: 120,
      friction: 14,
    },
  });
  return transitions(
    (_styles, show) =>
      show && (
        <animated.div className={styles.box} style={{ ..._styles }}>
          {element}
        </animated.div>
      )
  );
}

export default Box;
