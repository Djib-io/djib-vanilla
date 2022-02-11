import {BoxError} from "../providers/BoxBrowser";
import axios from "axios";
import {createPaymentReqConfig, uploadReqConfig} from "./configs";
import {createTransaction, parseURL} from "@solana/pay";
import BigNumber from "bignumber.js";
import {Connection, PublicKey, Transaction} from "@solana/web3.js";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";


export async function payment(
    network: WalletAdapterNetwork,
    connection: Connection,
    files: File[],
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
    publicKey: PublicKey
) {
    const totalSize = files.reduce((a, b) => a + b.size, 0) / 1024;
    const response = await axios(createPaymentReqConfig(totalSize, files.map(file => file.name))(network))

    const url = response?.data?.result[0] as string;
    const {recipient, amount, splToken} = parseURL(url);

    try {
        const tx = await createTransaction(connection, publicKey, recipient, amount as BigNumber, {
            splToken
        });
        tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
        tx.feePayer = publicKey;
        const signedTransaction = await signTransaction(tx);
        return await connection.sendRawTransaction(signedTransaction.serialize())
    } catch (e: any) {
        if (e?.message === 'payer not found' || e?.name === 'TokenAccountNotFoundError') {
            throw BoxError('You do not have djib tokens in your wallet')
        } else if (e?.message?.includes('insufficient')) {
            throw BoxError('Your funds are insufficient')
        }
        throw e
    }
}


export async function upload(
    network: WalletAdapterNetwork,
    files: File[],
    publicKey: PublicKey,
    signature: string
) {
    const data = new FormData()

    files.forEach(file => {
        data.append('files[]', file);
    })

    data.append('txid', signature);
    data.append('publickey', publicKey.toString());
    data.append('type', 'public');

    await axios(uploadReqConfig(data)(network))
}