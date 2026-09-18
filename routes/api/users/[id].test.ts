import { H3Event } from "nitro/h3";
import { describe, expect, it } from "vitest";

import getUser from "./[id]";

/**
 * INTEGRATION TEST
 *
 * Dynamic route params come from `event.context.params` — Nitro's router
 * populates that from the URL's `[id]` segment normally, so a direct
 * handler call needs to set it explicitly, the same way
 * routes/api/hello.test.ts sets `event.context.user` for its middleware.
 */
describe("GET /api/users/:id", () => {
  it("returns the matching user", async () => {
    const event = new H3Event(new Request("http://localhost/api/users/1"), {
      params: { id: "1" },
    });

    const result = await getUser(event);

    expect(result).toEqual({ user: { id: 1, name: "John Doe", email: "john@example.com" } });
  });

  it("throws a 404 for an id that doesn't exist", () => {
    const event = new H3Event(new Request("http://localhost/api/users/999"), {
      params: { id: "999" },
    });

    try {
      getUser(event);
      expect.fail("expected getUser to throw");
    } catch (error) {
      expect(error).toMatchObject({ status: 404, message: "User not found" });
    }
  });
});
