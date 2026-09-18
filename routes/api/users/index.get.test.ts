import { H3Event } from "nitro/h3";
import { describe, expect, it } from "vitest";

import listUsers from "./index.get";

/**
 * INTEGRATION TEST
 *
 * Same H3Event pattern as routes/api/hello.test.ts, minus the middleware
 * step — this route doesn't read anything from `event.context`.
 */
describe("GET /api/users", () => {
  it("returns the mock user list", async () => {
    const event = new H3Event(new Request("http://localhost/api/users"));

    const result = await listUsers(event);

    expect(result).toEqual({
      users: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ],
    });
  });
});
