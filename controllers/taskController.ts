import { Context } from "https://deno.land/x/hono@v4.3.6/mod.ts";

import { UpdateTaskReq } from "../types/type.ts";
import { TaskService } from "../services/index.ts";

//* Get all tasks
export const getTasks = async (c: Context) => {
    try {
        const allTasks = await TaskService.getAllTasks();
        return c.json(allTasks);
    } catch (error) {
        c.status(500);
        return c.json({ message: error.message });
    }
}

//* Get a task
export const getTask = async (c: Context) => {
    try {
        const taskId = c.req.param("id") as string;
        const task = await TaskService.getTaskById(taskId);
        return c.json(task);
    } catch (error) {
        if (error.message === "Invalid task ID") {
            c.status(400);
        } else if (error.message === "Task not found") {
            c.status(404);
        } else {
            c.status(500);
        }
        return c.json({ message: error.message });
    }
}

//* Create a new task
export const createTask = async (c: Context) => {
    try {
        const taskData = await c.req.json();
        const newTask = await TaskService.createTask(taskData);
        return c.json(newTask);
    } catch (error) {
        if (error.message === "Task already exists") {
            c.status(409);
        } else if (error.message === "Invalid task data") {
            c.status(400);
        } else {
            c.status(500);
        }
        return c.json({ message: error.message });
    }
}

//* Update a task
export const updateTask = async (c: Context) => {
    try {
        const taskId = c.req.param("id") as string;
        const payload: UpdateTaskReq = await c.req.json();
        const result = await TaskService.updateTaskById(taskId, payload);
        
        return c.json(result);
    } catch (error) {
        if(error.message === 'Invalid task ID') {
            c.status(400);
        } else if (error.message === 'Task not found') {
            c.status(404);
        } else {
            c.status(500);
        }

        return c.json({ message: error.message });
    }
}

//* Delete all tasks
export const deleteTasks = async (c: Context) => {
    try {
        const deletedCount = await TaskService.deleteAllTasks();
        return c.json({ message: `${deletedCount} Tasks deleted successfully` });
    } catch (error) {
        if (error.message === "No tasks found to delete") {
            c.status(404);
        } else {
            c.status(500);
        }
        return c.json({ message: error.message });
    }
}

//* Delete a task
export const deleteTask = async (c: Context) => {
    try {
        const taskId = c.req.param("id") as string;
        await TaskService.deleteTaskById(taskId);
        return c.json({ message: "Task deleted successfully" });
    } catch (error) {
        if (error.message === "Invalid task ID") {
            c.status(400);
        } else if (error.message === "Task not found") {
            c.status(404);
        } else {
            c.status(500);
        }
        return c.json({ message: error.message });
    }
}