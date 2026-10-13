export interface AppConfig {
  geminiApiKey: string;
  geminiModel: string;
  geminiTemperature: number;
  logLevel: "debug" | "info" | "warn" | "error";
}
