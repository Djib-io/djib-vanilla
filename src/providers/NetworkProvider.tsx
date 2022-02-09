import React, {createContext, useContext, useState} from "react";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";


const NetworkContext = createContext<WalletAdapterNetwork>(WalletAdapterNetwork.Mainnet)
const NetworkDispatchContext = createContext<React.Dispatch<any>>(() => null)


export const clusterApiUrl = (network: WalletAdapterNetwork) => {
    switch (network) {
        case WalletAdapterNetwork.Mainnet:
            return 'https://main.djib.io/'
        case WalletAdapterNetwork.Devnet:
            return 'https://dev.djib.io/'
        case WalletAdapterNetwork.Testnet:
            return 'https://test.djib.io/'
    }
}

const NetworkProvider:React.FC = ({ children }) => {
    const [state, setState] = useState(WalletAdapterNetwork.Devnet)

    return (
        <NetworkDispatchContext.Provider value={setState}>
            <NetworkContext.Provider value={state}>
                {children}
            </NetworkContext.Provider>
        </NetworkDispatchContext.Provider>
    );
}

export default NetworkProvider;


export const useNetwork = () => useContext(NetworkContext)
export const useNetworkDispatch = () => useContext(NetworkDispatchContext)