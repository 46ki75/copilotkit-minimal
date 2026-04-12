import { v4, v7 } from "uuid";
import z from "zod";

import { ToolCallStatus, useHumanInTheLoop } from "@copilotkit/react-core/v2";

// Components
import {
  ElmCodeBlock,
  ElmInlineText,
  ElmParagraph,
  ElmToggle,
} from "@elmethis/react";
import { ToolApproval } from "../components/ToolApproval";

const approvalSchema = z.object({
  version: z.enum(["v4", "v7"]).describe("Version of UUID to generate"),
  uuid: z.string().describe("The generated UUID"),
});

const rejectionSchema = z.object({
  errors: z.array(z.string()).describe("List of error messages"),
});

const approvalOrRejectionSchema = z.union([approvalSchema, rejectionSchema]);

export const useGenerateUuidFrontendTool = () => {
  useHumanInTheLoop({
    name: "generate_uuid",
    description: "Generate a new UUID of a specified version (v4 or v7)",
    parameters: z.object({
      version: z.enum(["v4", "v7"]).default("v4"),
    }),

    render: ({ args, respond, status, result }) => {
      const approveHandler = () => {
        if (status === ToolCallStatus.Executing) {
          const genFnMap: Record<typeof args.version, () => string> = {
            v4: v4,
            v7: v7,
          };

          const uuid = genFnMap[args.version]();

          const response: z.infer<typeof approvalSchema> = {
            version: args.version,
            uuid,
          };

          respond(response);
        }
      };

      const rejectHandler = () => {
        if (status === ToolCallStatus.Executing) {
          const response: z.infer<typeof rejectionSchema> = {
            errors: ["User rejected the operation"],
          };

          respond(response);
        }
      };

      const renderResult = (result?: string) => {
        if (status === ToolCallStatus.Complete) {
          let parsed: unknown;
          try {
            parsed = result !== undefined ? JSON.parse(result) : undefined;
          } catch {
            parsed = result;
          }
          const response = approvalOrRejectionSchema.safeParse(parsed);

          if (response.success) {
            const data = response.data;

            if ("errors" in data) {
              return <div>ERROR</div>;
            } else {
              return (
                <div>
                  <ElmCodeBlock
                    language="json"
                    code={JSON.stringify(data, null, 2)}
                  ></ElmCodeBlock>
                </div>
              );
            }
          }

          return (
            <div>
              <div>Invalid response format</div>
              <div>{JSON.stringify(result)}</div>
            </div>
          );
        }
      };

      return (
        <div>
          <ToolApproval
            status={status}
            onApprove={approveHandler}
            onReject={rejectHandler}
            resultContent={
              <ElmToggle summaryContent={"View Result"}>
                {renderResult(result)}
              </ElmToggle>
            }
          >
            <ElmParagraph>
              <ElmInlineText>
                Are you sure you want to generate a new UUID of version
                {args.version}?
              </ElmInlineText>
            </ElmParagraph>
          </ToolApproval>
        </div>
      );
    },
  });
};
