import classNames from "classnames";
import React from "react";
import styles from "./../styles/modules/Button.module.scss";

export type ButtonProps = {
  children: React.ReactChild;
  onClick?: () => any;
  className?: string;
  light?: boolean;
};

function Button({ children, onClick, className, light }: ButtonProps) {
  return (
    <div
      className={classNames(styles.button, {
        [styles.light]: light,
        [className || ""]: className,
      })}
      onClick={() => onClick && onClick()}
    >
      {children}
    </div>
  );
}

export default Button;
