import styles from "./../styles/modules/Nav.module.scss";
import { ReactComponent as Logo } from "./../assets/images/logo.svg";
import classNames from "classnames";
import WalletButton from "./WalletButton";

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

        <div className="ms-auto">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}

export default Nav;
