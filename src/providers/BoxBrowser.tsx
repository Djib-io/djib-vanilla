import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { Actions } from "./types";

export type BoxStatus = "loading" | "error" | "success" | "normal";

export type BoxBrowserState = {
  path: string;
  status: BoxStatus;
  message?: string;
  stack: string[];
};

const initialValue: BoxBrowserState = {
  path: "",
  status: "normal",
  stack: [],
};

const BoxBrowserContext = createContext<BoxBrowserState>(initialValue);
const BoxBrowserDispatchContext = createContext<React.Dispatch<any>>(
  () => null
);

type BoxBrowserActionsMap = {
  setPath: string;
  pop: string;
  setStatus: {
    status: BoxStatus;
    message?: string;
  };
};

function reducer(
  state: BoxBrowserState,
  action: Actions<BoxBrowserActionsMap>
) {
  switch (action.type) {
    case "setPath":
      return {
        ...state,
        path: action.payload,
        stack: [...state.stack, action.payload],
      };
    case "pop":
      const index = state.stack.indexOf(action.payload);
      if (index < 0) return state;
      const newStack = state.stack.slice(0, index + 1);
      return { ...state, stack: newStack, path: newStack[newStack.length - 1] };
    case "setStatus":
      return {
        ...state,
        status: action.payload.status,
        message: action.payload.message,
      };
  }
}

const BoxBrowser: React.FC<{ defaultPath: string }> = ({
  children,
  defaultPath,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    path: defaultPath,
    status: "normal",
    stack: [],
  });

  return (
    <BoxBrowserDispatchContext.Provider value={dispatch}>
      <BoxBrowserContext.Provider value={state}>
        {children}
      </BoxBrowserContext.Provider>
    </BoxBrowserDispatchContext.Provider>
  );
};

export default BoxBrowser;

export const useBox = () => useContext(BoxBrowserContext);

export const useBoxDispatch = () => {
  const dispatch = useContext(BoxBrowserDispatchContext);

  const navigate = useCallback(
    (path: string) => {
      dispatch({
        type: "setPath",
        payload: path,
      });
    },
    [dispatch]
  );

  const updateStatus = useCallback(
    (status: BoxStatus, message?: string) => {
      dispatch({
        type: "setStatus",
        payload: { status, message },
      });
    },
    [dispatch]
  );

  const popStack = useCallback(
    (item) => {
      dispatch({
        type: "pop",
        payload: item,
      });
    },
    [dispatch]
  );

  const automateStatusChanger = useCallback(
    (
      promise: Promise<string | undefined | void>,
      callbacks: {
        success: () => void;
      }
    ) => {
      dispatch({
        type: "setStatus",
        payload: { status: "loading" },
      });
      promise
        .then((res) => {
          if (callbacks?.success) {
            callbacks.success();
          } else {
            dispatch({
              type: "setStatus",
              payload: {
                status: "success",
                message: res,
              },
            });
          }
        })
        .catch((e) => {
          console.log({ e });
          if (e?.error?.code === -32603) {
            dispatch({
              type: "setStatus",
              payload: { status: "normal" },
            });
          } else {
            dispatch({
              type: "setStatus",
              payload: {
                status: "error",
                message:
                  e.type !== "BoxError"
                    ? "There is a problem.\nPlease try again later"
                    : e.message,
              },
            });
          }
        });
    },
    [dispatch]
  );

  return { navigate, automateStatusChanger, updateStatus, popStack };
};

export function BoxError(message: string) {
  return { type: "BoxError", message };
}
