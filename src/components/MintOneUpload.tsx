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
import FileComponent from "./File";
import { upload } from "../api/thunks";
import { useNetwork } from "../providers/NetworkProvider";
import { useDjibConnection } from "../providers/DjibConnectionProvider";

function MintOneUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ multiple: false });
  const network = useNetwork();
  const { signTransaction, publicKey } = useWallet();
  const { automateStatusChanger, navigate, updateStatus } = useBoxDispatch();
  const { status } = useBox();
  const uploadDispatch = useUploadDispatch();
  const [ref, { height: viewHeight }] = useMeasure();
  const djibConn = useDjibConnection();

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
    setFiles((prev) => acceptedFiles);
  }, [acceptedFiles]);

  const handleUpload = useCallback(async () => {
    if (!signTransaction || !publicKey) return;
    automateStatusChanger(
      (async () => {
        const { result } = await djibConn.upload({
          files: files,
          publicKey: publicKey.toBase58(),
        });
        console.log([...result, files[0].type]);
        uploadDispatch([...result, files[0].type.split('/')[1]]);
      })(),
      {
        success: () => {
          updateStatus("normal");
          navigate("mint-one");
        },
      }
    );
  }, [
    signTransaction,
    publicKey,
    automateStatusChanger,
    djibConn,
    files,
    uploadDispatch,
    updateStatus,
    navigate,
  ]);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = prev.slice();
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

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
      <animated.div
        style={{
          height,
          opacity,
          overflow: "hidden",
        }}
      >
        <div ref={ref}>
          <div
            className={classNames("d-flex flex-column", styles.files)}
            style={{ gap: "8px", paddingTop: files.length ? "16px" : 0 }}
          >
            {files.map((file, index) => (
              <FileComponent
                key={`file-${index}`}
                index={index}
                file={file}
                onRemove={handleRemoveFile}
              />
            ))}
          </div>
          {Boolean(files.length) && (
            <div
              className={
                "d-flex justify-content-center align-items-center mt-4"
              }
            >
              <Button onClick={handleUpload}>Next</Button>
            </div>
          )}
        </div>
      </animated.div>
    </section>
  );
}

export default MintOneUpload;
