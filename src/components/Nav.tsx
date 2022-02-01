import styles from "./../styles/modules/Nav.module.scss";
import { ReactComponent as Logo } from "./../assets/images/logo.svg";
import classNames from "classnames";
import WalletButton from "./WalletButton";
import Dropdown from "./Dropdown";
import { networkOptions } from "../constants/options";

function Nav() {
  return (
    <div className={classNames(styles.nav)}>
      <div
        className={classNames(
          "container",
          "d-flex",
          "align-items-center",
          styles.container
        )}
      >
        <div className={styles.logo}>
          <Logo />
        </div>

        <div className={styles.right}>
          <Dropdown defaultValue="mainnet" className={styles.networkDropdown} options={networkOptions}>Network :</Dropdown>

          <WalletButton />
        </div>
      </div>
    </div>
  );
}

export default Nav;
