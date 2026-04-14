import { v4, v7 } from "uuid";
import z from "zod";
import { useFrontendToolWithApproval } from "./use-frontend-tool-with-approval";

export const useGenerateUuidFrontendTool = () => {
  useFrontendToolWithApproval({
    confirmMessage: "Do you want to generate a new UUID?",
    name: "generate_uuid",
    description: "Generate a new UUID of a specified version (v4 or v7)",
    parameters: z.object({
      version: z.enum(["v4", "v7"]).default("v4"),
    }),

    handler: async ({ version }) => {
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
  });
};
