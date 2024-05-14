import { Hono } from "https://deno.land/x/hono@v4.3.6/mod.ts";
import { task } from "../controllers/index.ts";

const tasks = new Hono();

//* Get all tasks
tasks.get('/', (c) => task.getTasks(c));

export default tasks;

