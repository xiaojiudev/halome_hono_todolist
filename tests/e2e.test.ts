// import { test, expect } from "npm:@jest/globals@29.7.0";
import { Hono } from "https://deno.land/x/hono@v4.3.6/mod.ts";
import { afterAll, describe, it } from "https://deno.land/std@0.154.0/testing/bdd.ts";
import { assertArrayIncludes, assertEquals, assertExists } from "https://deno.land/std@0.154.0/testing/asserts.ts";

import tasks from "../routers/taskRoute.ts";
import { connectDB } from "../models/db.ts";
import { TaskSchema } from "../models/taskModel.ts";
import { deleteAllTasks } from "../services/taskService.ts";
import { CreateTaskReq, UpdateTaskReq } from "../types/type.ts";

await connectDB();

describe("E2E Test - Task API", () => {
    const app = new Hono();
    const BASE_URI = "http://localhost:8080";
    app.route('/tasks', tasks);

    let task: TaskSchema;

    afterAll(async () => {
        await deleteAllTasks();
    })

    describe('POST /tasks', () => {
        it("should add one task", async () => {
            const payload: CreateTaskReq = {
                taskName: "Buy groceries"
            }
            const res = await app.request(`${BASE_URI}/tasks`, {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            task = await res.json();

            assertEquals(res.status, 200);
            assertExists(task);
            assertEquals(task.taskName, payload.taskName);
        })
    });

    describe('GET /tasks', () => {
        it("should get all tasks", async () => {
            const res = await app.request(`${BASE_URI}/tasks`, {
                method: 'GET'
            });

            const data = await res.json();

            assertEquals(res.status, 200);
            assertArrayIncludes([...data], [task]);
        });

        it("should return a task", async () => {
            const res = await app.request(`${BASE_URI}/tasks/${task._id}`, {
                method: 'GET'
            });

            const data = await res.json();

            assertEquals(res.status, 200);
            assertEquals(data, task);
        });
    });

    describe('PUT /tasks', () => {
        it("should update a task", async () => {
            const payload: UpdateTaskReq = {
                taskName: "Buy groceries update",
                taskCompleted: true,
            }
            task = { ...task, ...payload };

            const res = await app.request(`${BASE_URI}/tasks/${task._id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            assertEquals(res.status, 200);
            assertEquals(data, task);
        });
    });


    describe('DELETE /tasks', () => {
        it("should delete a task", async () => {
            const res = await app.request(`${BASE_URI}/tasks/${task._id}`, {
                method: 'DELETE',
            });

            const allTasks = await app.request(`${BASE_URI}/tasks`, {
                method: 'GET'
            });

            const data: TaskSchema[] = await allTasks.json();

            assertEquals(res.status, 200);
            assertArrayIncludes(data, []);
            assertEquals(data.length, 0);
        });

        it("should delete all tasks", async () => {
            const res = await app.request(`${BASE_URI}/tasks`, {
                method: 'DELETE',
            });

            const allTasks = await app.request(`${BASE_URI}/tasks`, {
                method: 'GET'
            });

            const data: TaskSchema[] = await allTasks.json();

            assertEquals(res.status, 200);
            assertArrayIncludes(data, []);
            assertEquals(data.length, 0);
        });
    });
});
