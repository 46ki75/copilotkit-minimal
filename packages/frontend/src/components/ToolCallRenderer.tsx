import { defineToolCallRenderer } from "@copilotkit/react-core/v2";
import {
  ElmCodeBlock,
  ElmDotLoadingIcon,
  ElmInlineText,
  ElmMdiIcon,
  ElmToggle,
} from "@elmethis/react";

// Styles
import styles from "./ToolCallRenderer.module.css";
import { mdiCheckCircle, mdiTools } from "@mdi/js";

export const ToolCallRenderer = defineToolCallRenderer({
  name: "*", // Wildcard matches all tools (like MCP tools)
  render: ({ name, status, result }) => {
    const summaryContent = () => {
      if (status === "inProgress" || status === "executing") {
        return (
          <>
            <ElmMdiIcon d={mdiTools} size="1.25rem" />
            <ElmDotLoadingIcon size="1.25rem" color="#6987b8" />
            <ElmInlineText code color="#6987b8">
              {name}
            </ElmInlineText>
          </>
        );
      }

      if (status === "complete") {
        return (
          <>
            <ElmMdiIcon d={mdiTools} size="1.25rem" />
            <ElmMdiIcon d={mdiCheckCircle} size="1.25rem" color="#4ba96f" />
            <ElmInlineText code color="#4ba96f">
              {name}
            </ElmInlineText>
          </>
        );
      }

      return <strong>{name}</strong>;
    };

    const detailContent = () => {
      if (status === "inProgress" || status === "executing") {
        return <div>Executing...</div>;
      }

      if (status === "complete") {
        return (
          <div>
            <ElmCodeBlock
              code={JSON.stringify(JSON.parse(result ?? "null"), null, 2)}
              language="json"
            ></ElmCodeBlock>
          </div>
        );
      }

      return null;
    };

    return (
      <ElmToggle
        summaryContent={
          <span className={styles["inline-summary"]}>{summaryContent()}</span>
        }
      >
        {detailContent()}
      </ElmToggle>
    );
  },
});
