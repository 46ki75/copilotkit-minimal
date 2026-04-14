import React from "react";

import styles from "./SuggestionPill.module.css";
import type { CopilotChatSuggestionPillProps } from "@copilotkit/react-core/v2";
import { ElmInlineText, ElmMdiIcon } from "@elmethis/react";
import { mdiMessageReplyTextOutline } from "@mdi/js";

export const SuggestionPill = React.forwardRef<
  HTMLButtonElement,
  CopilotChatSuggestionPillProps
>(({ children, onClick, icon }, ref) => {
  return (
    <div className={styles["suggestion-pill"]}>
      <div>{icon}</div>
      <ElmMdiIcon d={mdiMessageReplyTextOutline} size="1rem" color="#c6ab69" />
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
