import React from "react";

import styles from "./SuggestionPill.module.css";
import type { CopilotChatSuggestionPillProps } from "@copilotkit/react-core/v2";
import { ElmInlineText } from "@elmethis/react";

export const SuggestionPill = React.forwardRef<
  HTMLButtonElement,
  CopilotChatSuggestionPillProps
>(({ children, onClick, icon }, ref) => {
  return (
    <div className={styles["suggestion-pill"]}>
      <div>{icon}</div>
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        onClick={onClick as React.MouseEventHandler}
      >
        <ElmInlineText>{children}</ElmInlineText>
      </div>
    </div>
  );
});

SuggestionPill.displayName = "SuggestionPill";
