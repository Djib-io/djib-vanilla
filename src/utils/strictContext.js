import React from "react";

export function createStrictContext(options = {}) {
  const StateContext = React.createContext(undefined);
  StateContext.displayName = options.name;
  const DispatchContext = React.createContext(undefined);
  DispatchContext.displayName = `${options.name}Dispatch`;

  function useStateContext() {
    const context = React.useContext(StateContext);
    if (context === undefined) {
      throw new Error(
        options.errorMessage ||
          `${options.name || ""} Context Provider is missing`
      );
    }
    return context;
  }

  function useDispatchContext() {
    const context = React.useContext(DispatchContext);
    if (context === undefined) {
      throw new Error(
        options.errorMessage ||
          `${options.name || ""} Context Provider is missing`
      );
    }
    return context;
  }

  function Provider({ children, value, dispatch }) {
    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={value}>{children}</StateContext.Provider>
      </DispatchContext.Provider>
    );
  }

  return [Provider, useStateContext, useDispatchContext];
}
