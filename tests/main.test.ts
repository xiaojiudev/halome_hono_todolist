import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { beforeEach, describe, it } from "https://deno.land/std@0.154.0/testing/bdd.ts"
import { assertArrayIncludes, assertEquals, assertObjectMatch, assertRejects } from "https://deno.land/std@0.154.0/testing/asserts.ts";

import { connectDB } from "../models/db.ts";
import { TaskService } from "../services/index.ts";
import { CreateTaskReq, UpdateTaskReq } from "../types/type.ts";

await connectDB();

describe("Unit Test - Task service", () => {
    const taskData: CreateTaskReq = { taskName: "Buy groceries" };
    const taskUpdatePayload: UpdateTaskReq = {
        taskName: "Buy groceries update",
        taskCompleted: true,
    };

    beforeEach(async () => {
        await TaskService.deleteAllTasks();
    });

    describe("Add task", () => {
        it("should add a new task to the database", async () => {
            const newTask = await TaskService.createTask(taskData);

            assertEquals(newTask?.taskName, taskData.taskName);
            assertEquals(newTask?.taskCompleted, false);
        });

        it("should throw an error if the task already exists", async () => {
            await TaskService.createTask(taskData);

            await assertRejects(async () => await TaskService.createTask(taskData), Error, "Task already exists");
        });
    });


    describe("Get tasks", () => {
        it("should return an empty array if there are no task in the database", async () => {
            const actualData = await TaskService.getAllTasks();
            assertArrayIncludes(actualData, []);
        });

        it("should return an array of all tasks in the database", async () => {
            const task1 = await TaskService.createTask({ taskName: "Buy groceries" });
            const task2 = await TaskService.createTask({ taskName: "Clean the house" });
            const task3 = await TaskService.createTask({ taskName: "Feed the dog" });

            const allTasks = await TaskService.getAllTasks();

            assertEquals([...allTasks], [task1, task2, task3]);
        });
    });

    describe("Get task", () => {
        it("should throw an error if task id is invalid", async () => {
            await assertRejects(async () => await TaskService.getTaskById("test_invalid_id"), Error, "Invalid task ID");
        });

        it("should throw an error if task not found", async () => {
            await assertRejects(async () => await TaskService.getTaskById(new ObjectId().toString()), Error, "Task not found");
        });

        it("should return a task by id", async () => {
            const resultTask = await TaskService.createTask(taskData);
            const extractTask = await TaskService.getTaskById(new ObjectId(resultTask?._id).toString());

            assertEquals([resultTask], [extractTask]);
        });
    });

    describe("Update task", () => {
        it("should throw an error if task id is invalid", async () => {
            await assertRejects(async () => await TaskService.updateTaskById("test_invalid_id", taskUpdatePayload), Error, "Invalid task ID");
        });

        it("should throw an error if task id not found", async () => {
            await assertRejects(async () => await TaskService.updateTaskById(new ObjectId().toString(), taskUpdatePayload), Error, "Task not found");
        });

        it("should return a task by id", async () => {
            const resultTask = await TaskService.createTask(taskData);

            const actualTask = await TaskService.updateTaskById(new ObjectId(resultTask?._id).toString(), taskUpdatePayload);

            const expectedTask = {
                _id: resultTask?._id,
                ...taskUpdatePayload
            };

            assertObjectMatch(actualTask, expectedTask);
        });
    });

    describe("Delete tasks", () => {
        it("should return an empty array if delete all tasks", async () => {
            await TaskService.deleteAllTasks();
            const actualData = await TaskService.getAllTasks();
            
            assertEquals([...actualData], []);
        });
    });

    describe("Delete task", () => {
        it("should throw an error if task id is invalid", async () => {
            await assertRejects(async () => await TaskService.deleteTaskById("test_invalid_id"), Error, "Invalid task ID");
        });

        it("should throw an error if task id not found", async () => {
            await assertRejects(async () => await TaskService.deleteTaskById(new ObjectId().toString()), Error, "Task not found");
        });

        it("should delete a task if task id found", async () => {
            const task = await TaskService.createTask(taskData);
            const taskId = new ObjectId(task?._id).toString();
            const deleteCount = await TaskService.deleteTaskById(taskId);

            assertEquals(deleteCount, 1);
            await assertRejects(async () => await TaskService.getTaskById(taskId), Error, "Task not found");
        });
    });
});
