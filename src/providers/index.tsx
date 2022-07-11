import { FC } from "react";
import { Wallet } from "./Wallet";
import NetworkProvider from "./NetworkProvider";
import DjibConnectionProvider from "./DjibConnectionProvider";

const Providers: FC = ({ children }) => {
  return (
    <DjibConnectionProvider>
      <NetworkProvider>
        <Wallet>{children}</Wallet>
      </NetworkProvider>
    </DjibConnectionProvider>
  );
};

export default Providers;
