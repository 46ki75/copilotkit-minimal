import { useFrontendTool } from "@copilotkit/react-core/v2";
import { ElmInlineText, ElmParagraph } from "@elmethis/react";
import { v4, v7 } from "uuid";
import z from "zod";

export const useGenerateUuidFrontendTool = () => {
  useFrontendTool({
    name: "generate_uuid",
    description: "Generate a new UUID of a specified version (v4 or v7)",
    parameters: z.object({
      version: z.enum(["v4", "v7"]).default("v4"),
    }),
    handler: async ({ version }) => {
      const genFnMap: Record<typeof version, () => string> = {
        v4: v4,
        v7: v7,
      };

      const uuid = genFnMap[version]();

      return { version, uuid };
    },
    render: ({ status, result }) => {
      return (
        <div>
          <ElmParagraph>
            You can define your custom render logic here ^.^
          </ElmParagraph>
          <ElmParagraph>{status}</ElmParagraph>
          <ElmParagraph>
            <ElmInlineText code>{JSON.stringify(result)}</ElmInlineText>
          </ElmParagraph>
        </div>
      );
    },
  });
};
