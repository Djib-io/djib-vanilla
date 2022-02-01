import { useSpring, animated } from "@react-spring/web";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { WalletIcon } from "@solana/wallet-adapter-react-ui";
import { useCallback, useEffect, useMemo } from "react";
import styles from "./../styles/modules/ConnectWallet.module.scss";
import Loading from "./Loading";

function ConnectWallet() {
  const { wallets, select, connecting } = useWallet();

  const [_animatedStyles, api] = useSpring(() => ({
    opacity: connecting ? 0 : 1,
    scale: connecting ? 0.5 : 1,
  }));

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
    api.start({
      opacity: connecting ? 0 : 1,
      scale: connecting ? 0.5 : 1,
    });
  }, [api, connecting]);

  const handleClick = useCallback(
    (walletName) => {
      select(walletName);
    },
    [select]
  );

  return (
    <div>
      <animated.div style={_animatedStyles}>
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
      </animated.div>
      <animated.div
        className={styles.loading}
        style={{
          opacity: _animatedStyles.opacity.to((value) => 1 - value),
          transform: _animatedStyles.scale.to(
            (value) => `scale(${1 - (value - 0.5)}) translate(-50%, -50%)`
          ),
        }}
      >
        <Loading />
      </animated.div>
    </div>
  );
}

export default ConnectWallet;
