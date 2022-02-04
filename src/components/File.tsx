import React, {useMemo} from 'react';
import styles from './../styles/modules/File.module.scss'
import {ReactComponent as FileIcon} from "./../assets/icons/file.svg";
import humanize from "../utils/humanize";

export type FileProps = {
    file: File
}
function File({ file }: FileProps) {

    const size = useMemo(() => humanize.number(file.size), [file]);

    return (
        <div className={styles.file}>
            <div className={styles.icon}><FileIcon /></div>
            <p className={styles.name}>{file.name}</p>
            <p className={styles.size}>{size.number}<span>{`${size.symbol}B`}</span></p>
        </div>
    );
}

export default File;