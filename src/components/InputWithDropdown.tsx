import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import useShow from "../hooks/useShow";
import { Option } from "../utils/types";
import ActionList from "./ActionList";
import Input, { InputProps } from "./Input";
import styles from "./../styles/modules/InputWithDropdown.module.scss";

export type InputWithDropdownProps = {
  options: Option[];
  inputProps?: InputProps;
  optionsStyle?: CSSProperties;
  onChange: (value: string) => void;
  thisArg?: any;
  disableEditableInput?: boolean;
};

function InputWithDropdown({
  options,
  inputProps,
  optionsStyle,
  onChange,
  disableEditableInput,
}: InputWithDropdownProps) {
  const [_options, setOptions] = useState(options);
  const [isShow, { show, hide }] = useShow();
  const [value, setValue] = useState("");

  useEffect(() => {
    setOptions(options);
  }, [options]);

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  const handleClick = useCallback(
    (id: string) => {
      setValue(_options.find((item) => item.value === id)?.label || "");
    },
    [_options]
  );

  const handleChangeInput: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = useCallback(
    (e) => {
      if (!disableEditableInput) {
        setValue(e.target.value);
        setOptions(() =>
          options.filter((item) =>
            item.label.toLowerCase().startsWith(e.target.value.toLowerCase())
          )
        );
      }
    },
    [disableEditableInput, options]
  );

  return (
    <div className={styles.container}>
      <Input
        type={"text"}
        {...inputProps}
        onChange={handleChangeInput}
        onFocus={show}
        onBlur={hide}
        value={value}
      />
      <ActionList
        show={isShow && !!_options.length}
        options={_options}
        onClick={handleClick}
        onClose={hide}
        fullWidth={true}
        style={{
          overflowY: "scroll",
          maxHeight: 400,
          ...optionsStyle,
        }}
        // @ts-ignore
        position={{ x: 0, y: "calc(100% + 10px)" }}
      />
    </div>
  );
}

export default InputWithDropdown;
