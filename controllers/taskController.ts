import { Context } from "https://deno.land/x/hono@v4.3.6/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

import Tasks from "../models/taskModel.ts";

//* Get all tasks
export const getTasks = async (c: Context) => {
    const allTasks = await Tasks.find({ taskName: undefined }).toArray();

    return c.json({ data: allTasks });
}
