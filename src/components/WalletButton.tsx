import React, { useState, useEffect, useCallback } from "react";
import Button from "./Button";
import styles from "./../styles/modules/WalletButton.module.scss";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletIcon } from "@solana/wallet-adapter-react-ui";
import { useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { walletMenu } from "../constants/options";

function WalletButton() {
  const { publicKey, wallet, connected } = useWallet();

  const [show, setShow] = useState(false);

  const [optionsRef, { height: viewHeight }] = useMeasure();
  const { height, opacity } = useSpring({
    from: { height: 0, opacity: 0 },
    to: {
      height: show ? viewHeight : 0,
      opacity: show ? 1 : 0,
    },
    config: {
      tension: 277,
      friction: 24,
      precision: 0.001,
      velocity: 0.011,
    },
  });

  useEffect(() => {
    const handleWindowClick = () => {
      setShow(false);
    };
    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleItemClick = useCallback((item: string) => {
    setShow(false);
  }, []);

  const handleButtonClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      if (connected) setShow((prev) => !prev);
    },
    [connected]
  );

  return (
    <div className={styles.container}>
      <Button
        className={styles.button}
        light={connected}
        onClick={handleButtonClick}
      >
        {publicKey ? (
          <>
            <WalletIcon wallet={wallet} />
            <p>{publicKey.toString()}</p>
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>
      <animated.div style={{ height, opacity }} className={styles.options}>
        <ul ref={optionsRef}>
          {walletMenu.map((option) => (
            <li
              key={`option-item-${option.value}`}
              onClick={() => handleItemClick((option as any).value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </animated.div>
    </div>
  );
}

export default WalletButton;
