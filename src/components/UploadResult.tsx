import React, {useCallback} from 'react';
import stylesUpload from './../styles/modules/UploadResult.module.scss'
import stylesStatus from "../styles/modules/StatusBox.module.scss";
import {useUpload} from "../providers/Upload";
import {useBoxDispatch} from "../providers/BoxBrowser";
import classNames from "classnames";
import {ReactComponent as SuccessIcon} from "../assets/icons/success.svg";
import Button from "./Button";
import {ReactComponent as BackIcon} from "../assets/icons/back.svg";
import {ReactComponent as DownloadIcon} from "../assets/icons/download.svg";

const styles = {...stylesUpload, ...stylesStatus}

function saveFile(filename: string, data: string) {
    const blob = new Blob([data], {type: 'text/plain'});
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}

function UploadResult() {
    const resultUpload = useUpload()
    const {navigate} = useBoxDispatch()
    
    const download = useCallback(() => {
        saveFile('files.txt', JSON.stringify(resultUpload, null, 1))
    }, [resultUpload])

    return (
        <div className={styles.statusBox}>
            <div className={classNames(styles.icon)}>
                <SuccessIcon/>
            </div>
            <p className={classNames(styles.title)}>Successfully!</p>
            <ul className={styles.result}>
                <li>{'['}</li>
                    {resultUpload.map(link => <li key={link}><a href={link} target="_blank" rel="noreferrer">{link},</a></li>)}
                <li>{']'}</li>
            </ul>
            <div className={styles.uplsave} style={{
                display: 'flex',
                gap: '16px',
                marginTop: '24px'
            }}>
                <Button startIcon={<BackIcon/>} onClick={() => navigate('upload')}>Upload Again</Button>
                <Button startIcon={<DownloadIcon/>} onClick={download}>Save Links</Button>
            </div>
        </div>
    );
}

export default UploadResult;