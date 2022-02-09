import React, {useCallback, useEffect, useState} from 'react';
import {useDropzone} from "react-dropzone";
import styles from './../styles/modules/Upload.module.scss'
import classNames from "classnames";
import FileComponent from "./File";
import Button from "./Button";
import {ReactComponent as FileIcon} from "./../assets/icons/file.svg";
import axios from "axios";
import {createPaymentReqConfig} from "../api/configs";
import {parseURL, createTransaction} from '@solana/pay';
import BigNumber from 'bignumber.js';
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {BoxError, useBox, useBoxDispatch} from "../providers/BoxBrowser";
import useMeasure from "react-use-measure";
import {animated, useSpring} from '@react-spring/web'

function Upload() {

    const [files, setFiles] = useState<File[]>([]);
    const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone();
    const {signTransaction, publicKey} = useWallet()
    const {connection} = useConnection()
    const {automateStatusChanger} = useBoxDispatch()
    const [ref, { height: viewHeight }] = useMeasure()
    const {status} = useBox()

    const { height, opacity } = useSpring({
        from: { height: 0, opacity: 1 },
        to: {
            height: status === "normal" ? viewHeight : 0,
            opacity: status === "normal" ? 1 : 0,
        },
        config: {
            tension: 277,
            friction: 24,
            precision: 0.001,
            velocity: 0.011,
        },
    });

    useEffect(() => {
        setFiles(prev => [...prev, ...acceptedFiles])
    }, [acceptedFiles])


    const handleRemoveFile = useCallback((index: number) => {
        setFiles(prev => {
            const newFiles = prev.slice()
            newFiles.splice(index, 1)
            return newFiles
        })
    }, [])


    const payment = useCallback(async () => {
        if (!publicKey) throw BoxError('You are not connected to your wallet!')

        const totalSize = files.reduce((a, b) => a + b.size, 0) / 1024;
        const response = await axios(createPaymentReqConfig(totalSize, files.map(file => file.name)))

        const url = response?.data?.result[0] as string;
        const {recipient, amount, splToken} = parseURL(url);

        try {
            const tx = await createTransaction(connection, publicKey, recipient, amount as BigNumber, {
                splToken
            });
            tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
            tx.feePayer = publicKey;
            // @ts-ignore
            const signedTransaction = await signTransaction(tx);
            await connection.sendRawTransaction(signedTransaction.serialize())
        }catch (e: any){
            if(e?.message === 'payer not found'){
                throw BoxError('You do not have djib tokens in your wallet')
            }else if(e?.message?.includes('insufficient')){
                throw BoxError('Your funds are insufficient')
            }
            throw e
        }
    }, [publicKey, files, connection, signTransaction])

    const handlePayment = useCallback(async () => {
        automateStatusChanger(payment())
    }, [payment, automateStatusChanger])


    return (
        <section className={styles.container}>
            <div {...getRootProps({className: classNames(styles.zone, {[styles.active]: isDragActive})})}>
                <input {...getInputProps()} />
                <div className={styles.fileIcon}>
                    <FileIcon/>
                </div>
                <p>Drop your files <span>here</span>, or browse</p>
            </div>
            <animated.div style={{
                height, opacity,
                overflow: 'hidden'
            }}>
                <div ref={ref}>
                    <div className={classNames('d-flex flex-column', styles.files)} style={{gap: '8px', paddingTop: files.length ? '16px' : 0}}>
                        {files.map((file, index) => <FileComponent key={`file-${index}`} index={index} file={file}
                                                                   onRemove={handleRemoveFile}/>)}
                    </div>
                    {Boolean(files.length) && (
                        <div className={'d-flex justify-content-center align-items-center mt-4'}>
                            <Button onClick={handlePayment}>Payment</Button>
                        </div>
                    )}
                </div>
            </animated.div>
        </section>
    );
}

export default Upload
;