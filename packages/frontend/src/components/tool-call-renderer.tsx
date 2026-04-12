import { defineToolCallRenderer } from "@copilotkit/react-core/v2";
import {
  ElmCodeBlock,
  ElmInlineText,
  ElmSpinner,
  ElmToggle,
} from "@elmethis/react";

export const ToolCallRenderer = defineToolCallRenderer({
  name: "*", // Wildcard matches all tools (like MCP tools)
  render: ({ name, status, result }) => {
    // if (status === "inProgress" || status === "executing") {
    //   return (
    //     <div
    //       style={{
    //         padding: "0.5rem",
    //         background: "#f3f4f6",
    //         borderRadius: "0.25rem",
    //         color: "#6b7280",
    //         fontSize: "0.875rem",
    //       }}
    //     >
    //       🔄 Executing: <strong>{name}</strong>...
    //     </div>
    //   );
    // }

    // if (status === "complete") {
    //   return (
    //     <div
    //       style={{
    //         padding: "0.5rem",
    //         background: "#ecfdf5",
    //         borderRadius: "0.25rem",
    //         color: "#065f46",
    //         fontSize: "0.875rem",
    //       }}
    //     >
    //       <ElmToggle summary={`✅ Finished: ${name}`}>
    //         <ElmCodeBlock
    //           code={JSON.stringify(JSON.parse(result), null, 2)}
    //           language="json"
    //         ></ElmCodeBlock>
    //       </ElmToggle>
    //     </div>
    //   );
    // }

    const summaryContent = () => {
      if (status === "inProgress" || status === "executing") {
        return (
          <span>
            <ElmSpinner />
            <ElmInlineText>Executing:&nbsp;</ElmInlineText>
            <ElmInlineText code color="#6987b8">
              {name}
            </ElmInlineText>
          </span>
        );
      }

      if (status === "complete") {
        return (
          <span>
            <ElmInlineText>Finished:&nbsp;</ElmInlineText>
            <ElmInlineText code color="#4ba96f">
              {name}
            </ElmInlineText>
          </span>
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
      <ElmToggle summaryContent={summaryContent()}>{detailContent()}</ElmToggle>
    );
  },
});
