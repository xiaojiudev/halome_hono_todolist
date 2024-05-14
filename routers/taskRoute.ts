import { Hono } from "https://deno.land/x/hono@v4.3.6/mod.ts";
import { task } from "../controllers/index.ts";

const tasks = new Hono();

//* Get all tasks
tasks.get('/', (c) => task.getTasks(c));

//* Get a task
tasks.get('/:id', (c) => task.getTask(c));

//* Create a new task
tasks.post('/', (c) => task.createTask(c));

//* Update a task
tasks.put('/:id', (c) => task.updateTask(c));

//* Delete all tasks
tasks.delete('/', (c) => task.deleteTasks(c));
export default tasks;

