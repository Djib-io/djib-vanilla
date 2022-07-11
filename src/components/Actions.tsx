import styles from "./../styles/modules/Actions.module.scss";
import { ReactComponent as UploadIcon } from "./../assets/icons/upload.svg";
import { ReactComponent as NFTIcon } from "./../assets/icons/nft.svg";
import { useBoxDispatch } from "../providers/BoxBrowser";

function Actions() {
  const { navigate } = useBoxDispatch();
  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <p>Select action</p>
      </div>
      <ul>
        <li onClick={() => navigate("upload")}>
          <UploadIcon />
          <p>Upload & Share files permanently</p>
        </li>
        <li onClick={() => navigate("mint-options")}>
          <NFTIcon />
          <p>Mint NFT</p>
        </li>
      </ul>
    </div>
  );
}

export default Actions;
