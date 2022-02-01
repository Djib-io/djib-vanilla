import {FC} from "react";
import {Wallet} from "./Wallet";
import NetworkProvider from "./NetworkProvider";

const Providers: FC = ({children}) => {
    return (
        <NetworkProvider>
            <Wallet>
                {children}
            </Wallet>
        </NetworkProvider>
    );
};

export default Providers;
