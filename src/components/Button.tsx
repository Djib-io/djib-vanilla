import classNames from "classnames";
import React from "react";
import styles from "./../styles/modules/Button.module.scss";

export type ButtonProps = {
  children: React.ReactChild;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
  className?: string;
  light?: boolean;
  isDisabled?: boolean;
  startIcon?: React.ReactChild;
};

function Button({ children, onClick, className, light, startIcon,isDisabled }: ButtonProps) {
  return (
    <div
      className={classNames(styles.button, {
        [styles.light]: light,
        [styles.disabled]: isDisabled,
        [className || ""]: className,
      })}
      onClick={(e) => onClick && onClick(e)}
    >
      {startIcon}
      {children}
    </div>
  );
}

export default Button;
