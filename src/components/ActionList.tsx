import { animated, useTransition } from "@react-spring/web";
import styles from "./../styles/modules/ActionList.module.scss";
import React, { CSSProperties, useRef } from "react";
import { Option, Position } from "../utils/types";
import classNames from "classnames";

export type ActionListProps = {
  show: boolean;
  options: Option[];
  onClick?: (
    id: string,
    e?: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => void;
  onClose?: () => void;
  fullWidth?: boolean;
  position?: Position;
  style?: CSSProperties;
};

const ActionList = React.forwardRef<HTMLDivElement, ActionListProps>(
  ({ show, options, onClick, onClose, fullWidth, position, style }, _ref) => {
    const ref = useRef(null);
    const tansition = useTransition(show && options.length, {
      from: { scale: 0.5, opacity: 0 },
      leave: { scale: 0.5, opacity: 0 },
      enter: {
        scale: 1,
        opacity: 1,
      },
      config: {
        tension: 250,
        friction: 18,
      },
    });

    const handleItemClick = (
      id: string,
      e: React.MouseEvent<HTMLLIElement, MouseEvent>
    ) => {
      if (onClick) onClick(id, e);
      if (onClose) onClose();
    };

    return tansition(
      (animationStyle, _show) =>
        _show && (
          <animated.div
            ref={ref}
            style={{
              ...animationStyle,
              ...(position && {
                top: position.y,
                left: position.x,
              }),
              ...style,
            }}
            className={classNames(styles.options, { "w-full": fullWidth })}
          >
            <ul>
              {options.map((option) => (
                <li
                  key={`option-item-${option.value}`}
                  onClickCapture={(e) => {
                    e.stopPropagation();
                    handleItemClick((option as any).value, e);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </animated.div>
        )
    );
  }
);

ActionList.displayName = "ActionList";
export default ActionList;
