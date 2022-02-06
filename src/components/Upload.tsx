import React, {useCallback, useEffect, useState} from 'react';
import {useDropzone} from "react-dropzone";
import styles from './../styles/modules/Upload.module.scss'
import classNames from "classnames";
import FileComponent from "./File";
import Button from "./Button";

function Upload() {

    const [files, setFiles] = useState<File[]>([]);
    const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone();


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


    return (
        <section className={styles.container}>
            <div {...getRootProps({className: classNames(styles.zone, {[styles.active]: isDragActive})})}>
                <input {...getInputProps()} />
                <p>Drop your files <span>here</span>, or browse</p>
            </div>
            <div className={'d-flex flex-column'} style={{gap: '8px', paddingTop: files.length ? '16px' : 0}}>
                {files.map((file, index) => <FileComponent key={`file-${index}`} index={index} file={file}
                                                           onRemove={handleRemoveFile}/>)}
            </div>
            {Boolean(files.length) && (
                <div className={'d-flex justify-content-center align-items-center mt-4'}>
                    <Button>Payment</Button>
                </div>
            )}

        </section>
    );
}

export default Upload
;