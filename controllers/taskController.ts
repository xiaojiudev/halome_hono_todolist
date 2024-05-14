import { Context } from "https://deno.land/x/hono@v4.3.6/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

import { CreateTaskReq, UpdateTaskReq } from "../types/type.ts";
import Tasks from "../models/taskModel.ts";

//* Get all tasks
export const getTasks = async (c: Context) => {
    const allTasks = await Tasks.find({ taskName: undefined }).toArray();

    return c.json({ data: allTasks });
}

//* Get a task
export const getTask = async (c: Context) => {
    const taskId = c.req.param('id') as string;

    if (!Bson.ObjectId.isValid(taskId)) {
        c.status(400);
        return c.json({
            message: 'Invalid task ID',
        });
    }

    const task = await Tasks.findOne({ _id: new Bson.ObjectId(taskId) });

    if (!task) {
        return c.json({ message: "Task not found", });
    }

    return c.json({ data: task, });
}
