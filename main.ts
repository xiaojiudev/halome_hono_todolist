import { Hono } from 'https://deno.land/x/hono@v4.3.6/mod.ts'
import { cors } from 'https://deno.land/x/hono@v4.3.6/middleware.ts'

import tasks from "./routers/taskRoute.ts";

const app = new Hono();

function startServer(): void {
    try {
        app.use(
            '*',
            cors({
                origin: '*',
                allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            })
        );
        
        //* Task Route
        app.route('/tasks', tasks);

        Deno.serve({ port: 8080 }, app.fetch);
    } catch (error) {
        console.log("Start server failed!", error);
    }
}

startServer();
