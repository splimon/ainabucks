import { WorkflowClient } from "@upstash/workflow/client";
import config from "../lib/config";

// Initialize Upstash Workflow Client
export const workflowClient = new WorkflowClient({
  qstashUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
  currentSigningKey: config.env.upstash.qstashCurrentSigningKey,
  nextSigningKey: config.env.upstash.qstashNextSigningKey,
});