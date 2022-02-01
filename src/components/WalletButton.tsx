import React from 'react';
import Button from './Button';
import styles from './../styles/modules/WalletButton.module.scss'
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletIcon } from '@solana/wallet-adapter-react-ui';

function WalletButton() {

    const { publicKey, wallet, connected } = useWallet()

    return (
        <div>
            <Button className={styles.button} light={connected} onClick={() => {}}>{publicKey ? (
                <>
                    <WalletIcon wallet={wallet} />
                    <p>{publicKey.toString()}</p>
                </>
            ) : 'Connect Wallet'}</Button>
        </div>
    );
}

export default WalletButton;