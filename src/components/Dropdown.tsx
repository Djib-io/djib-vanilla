import { useSpring, animated } from "@react-spring/web";
import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { ReactComponent as DropdownIcon } from "./../assets/icons/dropdown.svg";
import styles from "./../styles/modules/Dropdown.module.scss";

export type Option = { value: string; label: string };

export type DropdownProps = {
  defaultValue?: string;
  placeholder?: string;
  options: Option[];
  className?: string;
  children?: string;
  onChange?: (value: string) => any;
};
function Dropdown({
  defaultValue,
  children,
  placeholder,
  options,
  className,
  onChange,
}: DropdownProps) {
  const [acitve, setActive] = useState(defaultValue);
  const [show, setShow] = useState(false);

  const [optionsRef, { height: viewHeight }] = useMeasure();
  const { height, opacity } = useSpring({
    from: { height: 0, opacity: 0 },
    to: {
      height: show ? viewHeight : 0,
      opacity: show ? 1 : 0,
    },
    config: {
      tension: 277,
      friction: 24,
      precision: 0.001,
      velocity: 0.011,
    },
  });

  useEffect(() => {
    const handleWindowClick = () => {
      setShow(false);
    };
    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleItemClick = useCallback((item: string) => {
    if (onChange) onChange(item);
    setActive(item);
    setShow(false);
  }, [onChange]);

  const handleButtonClick = useCallback((
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShow((prev) => !prev);
  }, []);

  return (
    <div className={styles.container}>
      {children && <p>{children}</p>}
      <div className={styles.dropdownWrapper}>

        <div
          className={classNames(styles.dropdown, {
            [className || ""]: className,
          })}
          onClick={handleButtonClick}
        >
          <p>
            {options.find((option) => option.value === acitve)?.label ||
              placeholder}
          </p>
          <DropdownIcon />
        </div>

        <animated.div style={{ height, opacity }} className={styles.options}>
          <ul ref={optionsRef}>
            {options.map((option) => (
              <li
                key={`option-item-${option.value}`}
                className={classNames({
                  [styles.active]: option.value === acitve,
                })}
                onClick={() => handleItemClick(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </animated.div>
      </div>
    </div>
  );
}

export default Dropdown;
