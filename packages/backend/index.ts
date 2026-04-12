import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

dotenv.config();

const fastify = Fastify({ logger: true });
const port = parseInt(process.env.PORT || "3000", 10);

fastify.register(cors, {
  origin: true,
});

// We let fastify parse the JSON body normally (remove custom parser)
fastify.all("/copilotkit", async (request, reply) => {
  // Create an OpenRouter client using the official provider
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const agent = new BuiltInAgent({
    // model: openrouter("openai/gpt-5.4-nano"),
    model: openrouter("minimax/minimax-m2.5"),
    maxSteps: 5, // Important: Allows the AI to read the tool output and write a final response
    mcpServers: [
      {
        url: "https://knowledge-mcp.global.api.aws",
        type: "http",
        options: {},
      },
    ],
    tools: [],
  });

  // 2. Attach the generated agent directly to the runtime
  const runtime = new CopilotRuntime({
    agents: {
      default: agent,
    },
  });

  try {
    const handler = copilotRuntimeNodeHttpEndpoint({
      endpoint: "/copilotkit",
      runtime,
    });

    // CopilotKit node HTTP endpoint expects the body to be accessible on the request for Express compatibility
    // Make sure we attach Fastify's parsed body to the raw request before passing it
    Object.assign(request.raw, { body: request.body });

    reply.hijack(); // Hand over to raw node HTTP handler
    return handler(request.raw, reply.raw);
  } catch (error) {
    request.log.error(error, "Error running CopilotKit endpoint");
    reply.status(500).send("Endpoint error");
  }
});

fastify.listen(
  { port, host: "0.0.0.0" },
  (err: Error | null, address: string) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`CopilotKit backend running on ${address}`);
  },
);
