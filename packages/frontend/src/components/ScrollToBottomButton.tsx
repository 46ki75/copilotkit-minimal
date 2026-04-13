import React from "react";

import styles from "./ScrollToBottomButton.module.css";
import { ElmMdiIcon } from "@elmethis/react";
import { mdiChevronDoubleDown } from "@mdi/js";

export interface ScrollToBottomButtonProps {
  style?: React.CSSProperties;

  onClick?: React.MouseEventHandler;
}

export const ScrollToBottomButton = (props: ScrollToBottomButtonProps) => {
  return (
    <nav
      className={styles["scroll-to-bottom-button"]}
      style={props.style}
      onClick={props.onClick}
    >
      <ElmMdiIcon d={mdiChevronDoubleDown} />
    </nav>
  );
};
