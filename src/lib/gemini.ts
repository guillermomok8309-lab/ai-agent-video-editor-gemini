import { ConfigError, GeminiError } from "./errors.js";
import { getConfig } from "../config/env.js";

export const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export interface GeminiGenerateOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiContentPart {
  text: string;
}

export interface GeminiContent {
  role?: string;
  parts: GeminiContentPart[];
}

export interface GeminiRequestPayload {
  contents: GeminiContent[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
    status?: string;
  };
}

export async function generateText(prompt: string, options: GeminiGenerateOptions = {}): Promise<string> {
  const config = getConfig();
  const apiKey = config.geminiApiKey;
  if (!apiKey) {
    throw new ConfigError("GEMINI_API_KEY is not configured");
  }

  const model = options.model ?? config.geminiModel;
  const temperature = options.temperature ?? config.geminiTemperature;

  const requestBody: GeminiRequestPayload = {
    contents: [{
      role: "user",
      parts: [{ text: prompt }],
    }],
    generationConfig: {
      temperature,
      maxOutputTokens: options.maxOutputTokens ?? 1024,
    },
  };

  const response = await fetch(`${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const json = (await response.json()) as GeminiResponse;

  if (!response.ok || json.error) {
    const message = json.error?.message ?? `Gemini request failed with status ${response.status}`;
    throw new GeminiError(message, response.status);
  }

  const text = json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  if (!text.trim()) {
    throw new GeminiError("Gemini returned empty content");
  }

  return text.trim();
}

export async function testGeminiConnection(): Promise<{ ok: boolean; model: string; message: string }> {
  const config = getConfig();
  const response = await generateText("Reply with OK in one word.", { model: config.geminiModel });
  return {
    ok: response.toUpperCase().includes("OK"),
    model: config.geminiModel,
    message: response,
  };
}
