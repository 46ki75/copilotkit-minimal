import React from "react";

import styles from "./puzzle-app.module.css";
import { Puzzle } from "./puzzle";

export interface PuzzleAppProps {
  style?: React.CSSProperties;
}

export const PuzzleApp = (props: PuzzleAppProps) => {
  return (
    <div className={styles["puzzle-app"]} style={props.style}>
      <Puzzle />
    </div>
  );
};
