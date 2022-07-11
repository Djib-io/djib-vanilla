import { useCallback, useState } from "react";

function useShow(initialValue: boolean = false) {
  const [isShow, setShow] = useState(initialValue);

  const show = useCallback(() => setShow(true), []);
  const hide = useCallback(() => setShow(false), []);
  const toggle = useCallback(() => setShow((prev) => !prev), []);

  return [isShow, { show, hide, toggle }] as const;
}

export default useShow;
