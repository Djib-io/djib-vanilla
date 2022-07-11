import React, { createContext, useContext } from "react";
import { DjibConnection } from "../utils/djibConnection";

const connection = new DjibConnection();
export const DjibConnectionContext = createContext(connection);

export type DjibConnectionProviderProps = {
  children: React.ReactNode;
};

function DjibConnectionProvider({ children }: DjibConnectionProviderProps) {
  return (
    <DjibConnectionContext.Provider value={connection}>
      {children}
    </DjibConnectionContext.Provider>
  );
}
export const useDjibConnection = () => useContext(DjibConnectionContext);
export default DjibConnectionProvider;
