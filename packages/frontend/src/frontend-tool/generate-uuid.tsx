import { useFrontendTool } from "@copilotkit/react-core/v2";
import { v4, v7 } from "uuid";
import z from "zod";
import { ToolCallRenderer } from "../components/ToolCallRenderer";
import { useConfirm } from "../hooks/use-confirm";

export const useGenerateUuidFrontendTool = () => {
  const { showConfirm, handleResponse } = useConfirm();

  useFrontendTool({
    name: "generate_uuid",
    description: "Generate a new UUID of a specified version (v4 or v7)",
    parameters: z.object({
      version: z.enum(["v4", "v7"]).default("v4"),
    }),
    handler: async ({ version }) => {
      const userConfirmed = await showConfirm(
        "Do you want to generate a new UUID?",
      );

      if (!userConfirmed) {
        return {
          version,
          uuid: null,
          isError: true,
          error: "User rejected the UUID generation.",
        };
      }

      try {
        const genFnMap: Record<typeof version, () => string> = {
          v4: v4,
          v7: v7,
        };

        const uuid = genFnMap[version]();

        return { version, uuid, isError: false };
      } catch (error: unknown) {
        return {
          version,
          uuid: null,
          isError: true,
          error: (error as Error)?.message,
        };
      }
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
  });
};
