import { generateText } from "./gemini.js";

export interface AgentTaskResult {
  output: string;
  model: string;
}

export async function runAgentTask(task: string, options: { model?: string; json?: boolean } = {}): Promise<AgentTaskResult> {
  const systemPrompt = `You are a video-editing AI agent. Provide concise but actionable guidance for a content creator. If the task is vague, ask clarifying questions. Use short bullets, clear sequencing, and practical execution steps. Keep output useful for a video production workflow.`;
  const prompt = `${systemPrompt}\n\nTask:\n${task}`;

  const text = await generateText(prompt, { model: options.model });
  const resultText = options.json ? maybeJsonify(text) : text;

  return {
    output: resultText,
    model: options.model ?? "gemini-2.0-flash",
  };
}

export async function createVideoPlan(task: string, model?: string): Promise<Record<string, unknown>> {
  const prompt = `You are a planning assistant for a video editor. Return valid JSON with keys: goal, audience, runtime_seconds, structure, shot_plan, deliverables, risks. Task: ${task}`;

  const response = await generateText(prompt, { model });
  const parsed = tryParseJson(response);

  return parsed ?? {
    goal: task,
    audience: "general",
    runtime_seconds: 30,
    structure: ["hook", "body", "cta"],
    shot_plan: ["Plan the first rough cut from the source footage"],
    deliverables: ["edited master video", "preview export"],
    risks: ["Lack of source footage detail"],
  };
}

function maybeJsonify(text: string): string {
  const parsed = tryParseJson(text);
  return parsed ? JSON.stringify(parsed, null, 2) : text;
}

function tryParseJson(value: string): Record<string, unknown> | null {
  const trimmed = value.trim();
  const start = trimmed.startsWith("{") || trimmed.startsWith("[") ? trimmed : null;
  if (!start) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed === "object" && parsed !== null ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}
