import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./../styles/modules/Upload.module.scss";
import classNames from "classnames";
import Button from "./Button";
import { ReactComponent as FileIcon } from "./../assets/icons/file.svg";
import { useWallet } from "@solana/wallet-adapter-react";
import { useBox, useBoxDispatch } from "../providers/BoxBrowser";
import useMeasure from "react-use-measure";
import { animated, useSpring } from "@react-spring/web";
import { useUploadDispatch } from "../providers/Upload";

function MintOneUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ multiple: false });
  const { signTransaction, publicKey } = useWallet();
  const { automateStatusChanger, navigate, updateStatus } = useBoxDispatch();
  const { status } = useBox();
  const uploadDispatch = useUploadDispatch();

  const { height, opacity } = useSpring({
    from: { height: 0, opacity: 1 },
    to: {
      height: status === "normal" ? 80 : 0,
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
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, [acceptedFiles]);

  const handleUpload = useCallback(() => {
    navigate("mint-one");
  }, [navigate]);

  return (
    <section className={styles.container}>
      <div
        {...getRootProps({
          className: classNames(styles.zone, { [styles.active]: isDragActive }),
        })}
      >
        <input {...getInputProps()} />
        <div className={styles.fileIcon}>
          <FileIcon />
        </div>
        <p>
          Drop your files <span>here</span>, or browse
        </p>
      </div>

      <div>
        <div
          className={"d-flex justify-content-center align-items-center mt-4"}
        >
          <Button onClick={handleUpload}>Mint</Button>
        </div>
      </div>
    </section>
  );
}

export default MintOneUpload;
