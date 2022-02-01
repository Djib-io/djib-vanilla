import classNames from "classnames";
import React from "react";
import styles from "./../styles/modules/Button.module.scss";

export type ButtonProps = {
  children: React.ReactChild;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
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
      onClick={(e) => onClick && onClick(e)}
    >
      {children}
    </div>
  );
}

export default Button;
