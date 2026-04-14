import { useFrontendTool } from "@copilotkit/react-core/v2";
import type { ReactFrontendTool } from "@copilotkit/react-core/v2";
import { ToolCallRenderer } from "../components/ToolCallRenderer";
import { useConfirm } from "./use-confirm";

export type ExtendedToolOptions<
  T extends Record<string, unknown> = Record<string, unknown>,
> = ReactFrontendTool<T> & {
  confirmMessage: string;
};

export const useFrontendToolWithApproval = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  tool: ExtendedToolOptions<T>,
  deps?: Parameters<typeof useFrontendTool>[1],
): void => {
  const { showConfirm, handleResponse } = useConfirm();

  useFrontendTool(
    {
      ...tool,
      handler: async (...args) => {
        const userConfirmed = await showConfirm(tool.confirmMessage);
        if (!userConfirmed) {
          return {
            isError: true,
            error: "User rejected the operation.",
          };
        }

        return tool.handler?.(...args);
      },
      render: ({ name, status, result, args }) => {
        return (
          <ToolCallRenderer
            name={name}
            status={status}
            result={result}
            args={args}
            onApprove={() => handleResponse(true)}
            onReject={() => handleResponse(false)}
          ></ToolCallRenderer>
        );
      },
    },
    deps,
  );
};
