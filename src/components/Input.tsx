import classNames from "classnames";
import React, { forwardRef } from "react";
import styles from "./../styles/modules/Input.module.scss";

export type InputProps = {
  fullWidth?: boolean;
  containerClassName?: string;
  textarea?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

const Input = forwardRef<HTMLDivElement, InputProps>(
  ({ fullWidth, containerClassName, textarea, value, type, ...props }, ref) => {
    return (
      <div
        className={classNames(styles.input, {
          [styles.fullWidth]: fullWidth,
          [containerClassName || ""]: containerClassName,
        })}
        ref={ref}
      >
        {textarea ? (
          <textarea {...props}>{value}</textarea>
        ) : (
          <>
            <input
              className={classNames({ [styles.djibType]: type === "djib" })}
              type={type === "djib" ? "number" : type}
              {...props}
              value={value}
            />
          </>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
