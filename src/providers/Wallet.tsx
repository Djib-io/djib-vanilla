import {FC, useMemo} from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import {
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {useNetwork} from "./NetworkProvider";
import {clusterApiUrl} from "@solana/web3.js";


const rpcEndPoint = {
    devnet: process.env.REACT_APP_API_DEV_BASE_URL,
    "mainnet-beta": process.env.REACT_APP_API_MAIN_BASE_URL,
    testnet:  process.env.REACT_APP_API_TEST_BASE_URL,
}

export const Wallet: FC = ({children}) => {

    const network = useNetwork()

    const endpoint = useMemo(() => rpcEndPoint[network] || clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter(),
            new SolletExtensionWalletAdapter({network}),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
