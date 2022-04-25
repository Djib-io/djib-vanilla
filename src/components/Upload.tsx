import {useCallback, useEffect, useState} from 'react';
import {useDropzone} from "react-dropzone";
import styles from './../styles/modules/Upload.module.scss'
import classNames from "classnames";
import FileComponent from "./File";
import Button from "./Button";
import {ReactComponent as FileIcon} from "./../assets/icons/file.svg";
import {useWallet} from "@solana/wallet-adapter-react";
import {useBox, useBoxDispatch} from "../providers/BoxBrowser";
import useMeasure from "react-use-measure";
import {animated, useSpring} from '@react-spring/web'
import {upload} from "../api/thunks";
import {useNetwork} from "../providers/NetworkProvider";
import {useUploadDispatch} from "../providers/Upload";

function Upload() {

    const [files, setFiles] = useState<File[]>([]);
    const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone();
    const network = useNetwork()
    const {signTransaction, publicKey} = useWallet()
    const {automateStatusChanger, navigate, updateStatus} = useBoxDispatch()
    const [ref, { height: viewHeight }] = useMeasure()
    const {status} = useBox()
    const uploadDispatch = useUploadDispatch()

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



    const handleUpload = useCallback(async () => {
        if(!signTransaction || !publicKey) return
        automateStatusChanger((async () => {
            const result = await upload(network, files, publicKey)
            uploadDispatch(result)
        })(), {
            success: () => {
                updateStatus('normal')
                navigate('result-upload')
            }
        })
    }, [signTransaction, publicKey, automateStatusChanger, network, files, uploadDispatch, updateStatus, navigate])


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
                            <Button onClick={handleUpload}>Upload</Button>
                        </div>
                    )}
                </div>
            </animated.div>
        </section>
    );
}

export default Upload
;