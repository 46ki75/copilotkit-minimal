import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createOpenAI } from "@ai-sdk/openai";

dotenv.config();

const fastify = Fastify({ logger: true });
const port = parseInt(process.env.PORT || "3000", 10);

fastify.register(cors, {
  origin: true,
});

// We let fastify parse the JSON body normally (remove custom parser)
fastify.all("/copilotkit", async (request, reply) => {
  // Create an OpenAI client configured for OpenRouter via Vercel AI SDK
  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  // 1. Define the agent using the custom model adapter and connect MCP servers natively
  const agent = new BuiltInAgent({
    model: openrouter("minimax/minimax-m2.5"),
    mcpServers: [
      {
        url: "https://mcp.copilotkit.ai/mcp", // Replace with your MCP server URL
        type: "http", // or "http" or "stdio" (stdio runs local executables, useful for development)
      },
    ],
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
