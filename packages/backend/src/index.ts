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
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const agent = new BuiltInAgent({
  model: openrouter(process.env.MODEL_ID || "openai/gpt-5.4-nano"),
  maxSteps: 200, // Important: Allows the AI to read the tool output and write a final response
  mcpServers: [
    {
      url: "https://mcp.context7.com/mcp",
      type: "http",
      options: {},
    },
  ],
  providerOptions: {
    openrouter: {
      reasoning: { effort: "medium" },
    },
  },
  tools: [],
});

const runtime = new CopilotRuntime({
  agents: {
    default: agent,
  },
});

const copilotHandler = copilotRuntimeNodeHttpEndpoint({
  endpoint: "/copilotkit",
  runtime,
});

fastify.all("/copilotkit", async (request, reply) => {
  try {
    Object.assign(request.raw, { body: request.body });

    reply.hijack(); // Hand over to raw node HTTP handler
    return copilotHandler(request.raw, reply.raw);
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
