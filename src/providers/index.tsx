import { FC } from "react";
import { Wallet } from "./Wallet";

const Providers: FC = ({ children }) => {
  return <Wallet>
    {children}
  </Wallet>;
};

export default Providers;
