import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { WalletIcon } from "@solana/wallet-adapter-react-ui";
import { useCallback, useEffect, useMemo } from "react";
import styles from "./../styles/modules/ConnectWallet.module.scss";
import { useBoxDispatch } from "../providers/BoxBrowser";

function ConnectWallet() {
  const { wallets, select, connecting, connected } = useWallet();
  const { updateStatus } = useBoxDispatch();

  const [, , allWallets] = useMemo(() => {
    const installed: Wallet[] = [];
    const notDetected: Wallet[] = [];
    const loadable: Wallet[] = [];

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.NotDetected) {
        notDetected.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Loadable) {
        loadable.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet);
      }
    }

    return [
      installed,
      [...loadable, ...notDetected],
      [...installed, ...loadable, ...notDetected],
    ];
  }, [wallets]);

  useEffect(() => {
    updateStatus(connecting ? "loading" : "normal");
  }, [updateStatus, connecting, connected]);

  const handleClick = useCallback(
    (walletName) => {
      select(walletName);
    },
    [select]
  );

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <p>Connect Wallet</p>
        <div>Select your wallet</div>
      </div>

      <ul className={styles.wallets}>
        {allWallets.map((wallet) => (
          <li
            key={`wallet-${wallet.adapter.name}`}
            onClick={() => handleClick(wallet.adapter.name)}
          >
            <WalletIcon wallet={wallet} />
            {wallet.adapter.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConnectWallet;
