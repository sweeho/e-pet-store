import { describe, expect, it } from "vitest";

import { cn } from "./cn";

/**
 * UNIT TEST
 *
 * Exercises a single pure function in isolation — no DOM, no network, no
 * other app modules. This is the pattern to copy for any new helper in
 * src/utils, src/helpers, or similar pure logic.
 */
describe("cn", () => {
  it("joins plain class name strings", () => {
    expect(cn("px-2", "py-2")).toBe("px-2 py-2");
  });

  it("drops falsy values", () => {
    expect(cn("px-2", false, undefined, null, "py-2")).toBe("px-2 py-2");
  });

  it("applies object and array syntax from clsx", () => {
    expect(cn("base", { active: true, disabled: false }, ["extra"])).toBe("base active extra");
  });

  it("resolves conflicting Tailwind utilities, keeping the last one", () => {
    // tailwind-merge should drop the earlier, conflicting padding utility
    // rather than emitting both classes.
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("lets a caller override variant classes via a trailing className", () => {
    // This is the exact pattern components use: cn(variantClasses, className)
    expect(cn("bg-primary text-white", "bg-destructive")).toBe("text-white bg-destructive");
  });
});
