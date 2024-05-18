import { Hono } from "https://deno.land/x/hono@v4.3.6/mod.ts";
import { task } from "../controllers/index.ts";

const taskRoute = new Hono();

//* Get all tasks
taskRoute.get('/', (c) => task.getTasks(c));

//* Get a task
taskRoute.get('/:id', (c) => task.getTask(c));

//* Create a new task
taskRoute.post('/', (c) => task.createTask(c));

//* Update a task
taskRoute.put('/:id', (c) => task.updateTask(c));

//* Delete all tasks
taskRoute.delete('/', (c) => task.deleteTasks(c));

//* Delete a task
taskRoute.delete('/:id', (c) => task.deleteTask(c));

export default taskRoute;