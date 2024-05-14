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

//* Create a new task
export const createTask = async (c: Context) => {
    const { taskName }: CreateTaskReq = await c.req.json();

    const taskExists = await Tasks.findOne({ taskName });

    if (taskExists) {
        c.status(409);
        throw new Error('Task already exists');
    };

    const task = await Tasks.insertOne({
        taskName,
        taskCompleted: false,
    });

    if (!task) {
        c.status(400);
        throw new Error('Invalid task data');
    };

    const retrieveTask = await Tasks.findOne({ _id: task });

    return c.json({
        data: retrieveTask,
        message: 'Task created successfully',
    });
}

//* Update a task
export const updateTask = async (c: Context) => {
    const taskId = c.req.param('id') as string;
    const { taskName, taskCompleted }: UpdateTaskReq = await c.req.json();

    if (!Bson.ObjectId.isValid(taskId)) {
        c.status(400);
        return c.json({
            message: 'Invalid task ID',
        });
    }

    const filter = { _id: new Bson.ObjectId(taskId) };
    const update = { $set: { taskName, taskCompleted } };

    const result = await Tasks.updateOne(filter, update);

    if (result.matchedCount === 0) {
        c.status(404);
        return c.json({ message: 'Task not found' });
    }

    return c.json({
        message: 'Task updated successfully',
    });
}

//* Delete all tasks
export const deleteTasks = async (c: Context) => {
    const deleteCount = await Tasks.deleteMany({ });

    if (deleteCount === 0) {
        return c.json({ message: 'No tasks found to delete' });
    }

    return c.json({
        message: `${deleteCount} Tasks deleted successfully`,
    });
}

//* Delete a task
export const deleteTask = async (c: Context) => {
    const taskId = c.req.param("id");

    if (!Bson.ObjectId.isValid(taskId)) {
        return c.json({ message: 'Invalid task ID' });
    }

    const deleteCount = await Tasks.deleteOne({ _id: new Bson.ObjectId(taskId) });

    if (deleteCount === 0) {
        return c.json({ message: 'Task not found' });
    }

    return c.json({
        message: 'Task deleted successfully',
    });
}