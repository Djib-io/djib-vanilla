import React, { useMemo } from "react";
import { useBox, useBoxDispatch } from "../providers/BoxBrowser";
import styles from "./../styles/modules/Breadcrumb.module.scss";
import { ReactComponent as Arrow } from "./../assets/icons/arrow-right.svg";
import classNames from "classnames";

const labels: {
  [key: string]: string;
} = {
  actions: "Actions",
  "mint-options": "Mint Options",
  upload: "Upload",
  "mint-one-upload": "Mint NFT",
  "mint-one": "Set NFT Props",
  "result-upload": "Upload Result",
};

function Breadcrumb() {
  const { stack } = useBox();
  const { popStack } = useBoxDispatch();

  const breadcrumb = useMemo(
    () => stack.filter((item) => labels[item]),
    [stack]
  );

  return (
    <div className={styles.container}>
      <div className={classNames(styles.item, styles.disabled)}>
        Djib Vanilla
      </div>
      {breadcrumb.map((item, i) => (
        <React.Fragment key={`breadcrumb-item-${item}`}>
          <Arrow />
          <div
            className={classNames(styles.item, {
              [styles.disabled]: i === breadcrumb.length - 1,
            })}
            onClick={() => {
              if (i === breadcrumb.length - 1) return;
              popStack(item);
            }}
          >
            {labels[item]}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb;
