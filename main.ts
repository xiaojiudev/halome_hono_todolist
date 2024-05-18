import { Hono } from 'https://deno.land/x/hono@v4.3.6/mod.ts';
import { cors } from 'https://deno.land/x/hono@v4.3.6/middleware.ts';

import { connectDB } from "./models/db.ts";
import taskRoute from "./routers/taskRoute.ts";
import { APP_PORT } from "./utils/bootstrap.ts";

const app = new Hono();

startServer();

async function startServer(): Promise<void> {
    try {
        await connectDB();

        appConfig();

        appRoutes();

        Deno.serve({ port: APP_PORT }, app.fetch);
    } catch (error) {
        console.log("Start server failed!", error);
    }
}

//* Setup app configuration
function appConfig(): void {
    app.use(
        '*',
        cors({
            origin: '*',
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        })
    );
}

//* Define app routes
function appRoutes(): void {
    app.route('/tasks', taskRoute);
}
