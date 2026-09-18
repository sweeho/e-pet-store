import { eq } from "drizzle-orm";
import { createError, defineHandler, getRouterParam } from "nitro/h3";

import { db } from "../../../db/client";
import { users } from "../../../db/schema";

export default defineHandler((event) => {
  const id = getRouterParam(event, "id");
  const numericId = Number(id);

  const user = Number.isNaN(numericId)
    ? undefined
    : db.select().from(users).where(eq(users.id, numericId)).get();

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  return { user };
});
