import { describe, expect, it } from "vitest";

import { createVideoPlan } from "../src/lib/agent.js";

describe("createVideoPlan", () => {
  it("returns a structured plan object even when Gemini is unavailable", async () => {
    const result = await createVideoPlan("Create a 20 second promo from B-roll and talking head clips");
    expect(result).toHaveProperty("goal");
    expect(result).toHaveProperty("structure");
  });
});
