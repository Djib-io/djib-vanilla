import React, {useCallback, useMemo} from 'react';
import styles from './../styles/modules/File.module.scss'
import {ReactComponent as FileIcon} from "./../assets/icons/file.svg";
import {ReactComponent as TrashIcon} from "./../assets/icons/trash.svg";
import humanize from "../utils/humanize";

export type FileProps = {
    file: File
    onRemove?: (index: number) => any,
    index: number
}

function File({file, onRemove, index}: FileProps) {

    const size = useMemo(() => humanize.number(file.size, {
        binaryMode: true
    }), [file]);


    const handleRemove = useCallback(() => {
        if(onRemove) onRemove(index)
    }, [onRemove, index])

    return (
        <div className={styles.container}>
            <div className={styles.removeButton} onClick={handleRemove}>
                <TrashIcon />
            </div>
            <div className={styles.file}>
                <div className={styles.icon}><FileIcon/></div>
                <p className={styles.name}>{file.name}</p>
                <p className={styles.size}>{size.number}<span>{`${size.symbol}B`}</span></p>
            </div>
        </div>
    );
}

export default File;