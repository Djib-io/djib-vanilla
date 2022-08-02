import styles from "./../styles/modules/Nav.module.scss";
import {ReactComponent as Logo} from "./../assets/images/logo.svg";
import classNames from "classnames";
import WalletButton from "./WalletButton";
import ReactTooltip from "react-tooltip";

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
                <a className={styles.logo} href="/">
                    <Logo/>
                </a>

                <div className={styles.right}>
                    <ReactTooltip place="right" type="dark" effect="solid"/>
                    <WalletButton/>
                </div>
            </div>
        </div>
    );
}

export default Nav;
