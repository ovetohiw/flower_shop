import { describe, expect, it } from "vitest";
import { formatRub } from "@/lib/money";

describe("formatRub", () => {
  it("formats whole rubles in ru-RU", () => {
    const formatted = formatRub(4900);
    expect(formatted).toContain("4");
    expect(formatted.replace(/\s/g, "")).toMatch(/4900/);
  });
});
