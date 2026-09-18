import { defineHandler } from "nitro/h3";

import { db } from "../../../db/client";
import { users } from "../../../db/schema";

export default defineHandler(() => {
  return { users: db.select().from(users).all() };
});
