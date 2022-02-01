import styles from "./../styles/modules/Nav.module.scss";
import {ReactComponent as Logo} from "./../assets/images/logo.svg";
import classNames from "classnames";
import WalletButton from "./WalletButton";
import Dropdown from "./Dropdown";
import {networkOptions} from "../constants/options";
import {useNetwork, useNetworkDispatch} from "../providers/NetworkProvider";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {useCallback} from "react";

function Nav() {

    const network = useNetwork()
    const networkDispatch = useNetworkDispatch()

    const handleNetworkChange = useCallback((value: string) => {
        if(value === WalletAdapterNetwork.Mainnet.valueOf()){
            networkDispatch(WalletAdapterNetwork.Mainnet)
        }else if(value === WalletAdapterNetwork.Devnet.valueOf()){
            networkDispatch(WalletAdapterNetwork.Devnet)
        }else if(value === WalletAdapterNetwork.Testnet.valueOf()){
            networkDispatch(WalletAdapterNetwork.Testnet)
        }
    }, [networkDispatch])

    return (
        <div className={classNames(styles.nav)}>
            <div
                className={classNames(
                    "container",
                    "d-flex",
                    "align-items-center",
                    styles.container
                )}
            >
                <div className={styles.logo}>
                    <Logo/>
                </div>

                <div className={styles.right}>
                    <Dropdown defaultValue={network.valueOf()} className={styles.networkDropdown} options={networkOptions}
                              onChange={handleNetworkChange}>Network :</Dropdown>
                    <WalletButton/>
                </div>
            </div>
        </div>
    );
}

export default Nav;
