import React from 'react';
import styles from "./../styles/modules/StatusBox.module.scss";
import {ReactComponent as SuccessIcon} from "./../assets/icons/success.svg";
import {ReactComponent as FailedIcon} from "./../assets/icons/failed.svg";
import {ReactComponent as BackIcon} from "./../assets/icons/back.svg";
import classNames from "classnames";
import {useBoxDispatch} from "../providers/BoxBrowser";

export type StatusBoxProps = {
    status: 'error' | 'success',
    message?: string
}

function StatusBox({ status, message }: StatusBoxProps) {
    const { updateStatus, popStack } = useBoxDispatch()

    return (
        <div className={styles.statusBox}>
            <div className={classNames(styles.back,  { [styles.error]: status === "error" })} onClick={() => {
                if (status === "success")
                    popStack('actions')
                updateStatus('normal')
            }}>
                <BackIcon />
                <p>Back</p>
            </div>
            <div className={classNames(styles.icon, { [styles.error]: status === "error" })}>
                {status === 'success' ? <SuccessIcon /> : <FailedIcon />}
            </div>
            <p className={classNames(styles.title, { [styles.error]: status === "error" })}>{status === 'success' ? 'Success!' : 'Failed!'}</p>
            <p className={styles.message}>{message}</p>
        </div>
    );
}

export default StatusBox;
