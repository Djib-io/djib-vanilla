import React, { useEffect, useRef } from "react";
import { useBox } from "../providers/BoxBrowser";
import { useTransition, animated, useSpring } from "@react-spring/web";
import styles from "./../styles/modules/Box.module.scss";
import Loading from "./Loading";
import StatusBox from "./StatusBox";

export type BoxProps = {
  path: string;
  element: React.ReactElement;
  successElement?: React.ReactElement;
  errorElement?: React.ReactElement;
};

const animationConfig = {
  from: { opacity: 0, scale: 0.4 },
  enter: { opacity: 1, scale: 1, x: 0 },
  leave: { opacity: 0, scale: 0.4 },
  delay: 0,
  config: {
    tension: 120,
    friction: 14,
  },
};

function Box({ path, element, successElement, errorElement }: BoxProps) {
  const { path: currentPath, status, message } = useBox();

  const ref = useRef<HTMLDivElement>(null);

  const loadingTransitions = useTransition(
    status === "loading",
    animationConfig
  );
  const errorTransitions = useTransition(status === "error", animationConfig);
  const successTransitions = useTransition(
    status === "success",
    animationConfig
  );

  const [contentAnimatedStyles, api] = useSpring(() => ({
    opacity: status !== "normal" ? 0 : 1,
  }));

  useEffect(() => {
    api.start({
      opacity: status !== "normal" ? 0 : 1,
    });
  }, [api, status]);

  useEffect(() => {
    if (ref.current) {
      new ResizeObserver(() => {
        if (Number(ref.current?.clientHeight) > window.innerHeight) {
          document.body.style.height = `${
            (ref.current?.clientHeight || 0) + 350
          }px`;
        } else {
          document.body.style.height = `100vh`;
        }
      }).observe(ref.current);
    }
  }, []);

  return (
    path === currentPath ? (
      <animated.div
        className={styles.box}
        ref={ref}
      >
        <animated.div
          className={styles.normal}
          style={{ opacity: contentAnimatedStyles.opacity }}
        >
          {element}
        </animated.div>

        {loadingTransitions(
          (loadingStyles, showLoading) =>
            showLoading && (
              <animated.div className={styles.loading} style={loadingStyles}>
                <Loading />
              </animated.div>
            )
        )}

        {errorTransitions(
          (errorStyles, showError) =>
            showError && (
              <animated.div className={styles.error} style={errorStyles}>
                {errorElement || (
                  <StatusBox status={"error"} message={message} />
                )}
              </animated.div>
            )
        )}

        {successTransitions(
          (successStyles, showSuccess) =>
            showSuccess && (
              <animated.div className={styles.success} style={successStyles}>
                {successElement || (
                  <StatusBox status={"success"} message={message} />
                )}
              </animated.div>
            )
        )}
      </animated.div>
    ) : null
  );
}

export default Box;
