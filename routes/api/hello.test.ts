import { H3Event } from "nitro/h3";
import { describe, expect, it } from "vitest";

import authMiddleware from "../../middleware/auth";
import hello from "./hello";

/**
 * INTEGRATION TEST
 *
 * Exercises two backend units together the way Nitro actually runs them: a
 * middleware handler that populates `event.context`, followed by a route
 * handler that reads it. No HTTP server or network call is involved — we
 * build a real H3Event (via `new H3Event(request, context)` from
 * "nitro/h3") and pass it through both handlers directly, which is fast and
 * exercises the real handler code paths. Copy this pattern for other
 * routes under routes/api that depend on middleware/ or on each other.
 */
describe("auth middleware + /api/hello route", () => {
  it("returns a personalized greeting using the context set by the auth middleware", async () => {
    const event = new H3Event(new Request("http://localhost/api/hello"));

    await authMiddleware(event);
    const result = await hello(event);

    expect(result).toEqual({ success: true, message: "Hello Yeasin" });
  });

  it("throws if the route runs without the auth middleware populating the context first", () => {
    const event = new H3Event(new Request("http://localhost/api/hello"));

    expect(() => hello(event)).toThrow();
  });
});
