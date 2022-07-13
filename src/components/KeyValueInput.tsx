/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./../styles/modules/KeyValueInput.module.scss";
import { v4 as uuid } from "uuid";
import classNames from "classnames";

export type AttrType = { attr: string; value: string };
export type KeyValueProps = {
  onChange: (id: string, key: string, data: string) => void;
  id: string;
  index: number;
  onCreateNewItem: () => void;
  onRemoveItem: (id: string) => void;
  isActive?: boolean;
  changeIndex: (index: number) => void;
} & AttrType;

function KeyValue({
  id,
  attr,
  value,
  onChange,
  onCreateNewItem,
  onRemoveItem,
  isActive,
  index,
  changeIndex,
}: KeyValueProps) {
  const attrRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const attrKeyupListener = (e: Event) => {
      // @ts-ignore
      onChange(id, "attr", e?.target?.innerText || "");
    };
    const valueKeyupListener = (e: Event) => {
      // @ts-ignore
      onChange(id, "value", e?.target?.innerText || "");
    };

    if (attrRef.current && valueRef.current) {
      attrRef.current.addEventListener("input", attrKeyupListener);
      valueRef.current.addEventListener("input", valueKeyupListener);
    }
    return () => {
      attrRef.current?.addEventListener("input", attrKeyupListener);
      valueRef.current?.addEventListener("input", valueKeyupListener);
    };
  }, []);

  useEffect(() => {
    const attrKeydownListener = (e: KeyboardEvent) => {
      // @ts-ignore
      if (e.code === "Backspace" && !e?.target?.innerText) {
        onRemoveItem(id);
      }
    };
    const valueKeydownListener = (e: KeyboardEvent) => {
      // @ts-ignore
      if (e.code === "Backspace" && !e?.target?.innerText) {
        attrRef.current?.focus();
      }
    };
    if (attrRef.current && valueRef.current) {
      attrRef.current.addEventListener("keydown", attrKeydownListener);
      valueRef.current.addEventListener("keydown", valueKeydownListener);
    }
    return () => {
      attrRef.current?.addEventListener("keydown", attrKeydownListener);
      valueRef.current?.addEventListener("keydown", valueKeydownListener);
    };
  }, [attr, id, onRemoveItem, value]);

  useEffect(() => {
    const attrListener = (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        e.preventDefault();
        valueRef.current?.focus();
      }
    };

    const valueListener = (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        e.preventDefault();
        onCreateNewItem();
      }
    };
    if (attrRef.current && valueRef.current) {
      attrRef.current.focus();
      attrRef.current.addEventListener("keypress", attrListener);
      valueRef.current.addEventListener("keypress", valueListener);
    }
    return () => {
      attrRef.current?.addEventListener("keypress", attrListener);
      valueRef.current?.addEventListener("keypress", valueListener);
    };
  }, []);

  return (
    <div className={classNames(styles.item, { [styles.active]: isActive })}>
      <span
        ref={attrRef}
        contentEditable={true}
        translate="no"
        autoCorrect="no"
        spellCheck="false"
        autoCapitalize={"no"}
        suppressContentEditableWarning={true}
        onClick={(e) => {
          e.stopPropagation();
          changeIndex(index);
        }}
        // @ts-ignore
        value={attr}
      />
      {/* {attr}
      </span> */}
      <span
        ref={valueRef}
        contentEditable={true}
        translate="no"
        autoCorrect="no"
        spellCheck="false"
        autoCapitalize={"no"}
        onClick={(e) => {
          e.stopPropagation();
          changeIndex(index);
        }}
        suppressContentEditableWarning={true}
        // @ts-ignore
        value={value}
      />
    </div>
  );
}

export type KeyValueInputProps = {
  onChange: (data: AttrType[]) => void;
};

function KeyValueInput({ onChange }: KeyValueInputProps) {
  const [state, setState] = useState<{
    data: {
      [key: string]: AttrType;
    };
    active: number;
  }>({
    data: {},
    active: -1,
  });

  useEffect(() => {
    onChange(Object.values(state.data));
  }, [state]);

  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const handleClick = useCallback(() => {
    if (!Object.keys(state.data).length) {
      setState({
        data: {
          [uuid()]: { attr: "", value: "" },
        },
        active: 0,
      });
    } else if (
      !Object.values(state.data).find(
        (item) =>
          item.attr === undefined || item.attr === "" || item.attr === null
      )
    ) {
      setState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [uuid()]: { attr: "", value: "" },
        },
        active: Object.keys(prev.data).length,
      }));
    }
  }, [state]);

  const handleChange = useCallback((id: string, key: string, data: string) => {
    setState((prev) => {
      const newData = {
        ...prev.data,
        [id]: {
          ...prev.data[id],
          [key]: data,
        },
      };
      return {
        ...prev,
        data: newData,
      };
    });
  }, []);

  const addNewItem = useCallback(() => {
    setState((prev) => {
      const newData = {
        ...prev.data,
        [uuid()]: { attr: "", value: "" },
      };
      return {
        ...prev,
        data: newData,
        active: Object.keys(newData).length - 1,
      };
    });
  }, []);

  const timeRef = useRef(Date.now());

  const removeItem = useCallback((id: string) => {
    if (Math.abs(timeRef.current - Date.now()) > 100) {
      setState((prev) => {
        const newState = { ...prev };
        if (newState.data[id]) {
          timeRef.current = Date.now();
          delete newState.data[id];
        }
        newState.active = Object.keys(newState.data).length - 1;
        return newState;
      });
    }
  }, []);

  const handleChangeActive = useCallback((index: number) => {
    setState((prev) => ({ ...prev, active: index }));
  }, []);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (
        e.key === "Backspace" &&
        document.activeElement?.tagName !== "SPAN" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        stateRef.current.active >= 0
      ) {
        removeItem(Object.keys(stateRef.current.data)[stateRef.current.active]);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div className={styles.container} onClick={handleClick}>
      {Object.keys(state.data).map((key, i) => (
        <KeyValue
          id={key}
          index={i}
          key={`key-value-input-${key}`}
          isActive={state.active === i}
          onChange={handleChange}
          changeIndex={handleChangeActive}
          onCreateNewItem={addNewItem}
          onRemoveItem={removeItem}
          {...state.data[key]}
        />
      ))}
    </div>
  );
}

export default KeyValueInput;
