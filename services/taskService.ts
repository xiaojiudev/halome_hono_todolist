import { Bson } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { CreateTaskReq, UpdateTaskReq } from "../types/type.ts";
import { getTasksCollection } from "../models/taskModel.ts";

export const getAllTasks = async () => {
    const Tasks = await getTasksCollection();
    return await Tasks.find({ taskName: undefined }).toArray();
};

export const getTaskById = async (taskId: string) => {
    if (!Bson.ObjectId.isValid(taskId)) {
        throw new Error("Invalid task ID");
    }

    const Tasks = await getTasksCollection();
    const task = await Tasks.findOne({ _id: new Bson.ObjectId(taskId) });
    if (!task) {
        throw new Error("Task not found");
    }

    return task;
};

export const createTask = async (taskData: CreateTaskReq) => {
    const { taskName } = taskData;
    const Tasks = await getTasksCollection();
    const taskExists = await Tasks.findOne({ taskName });
    
    if (taskExists) {
        throw new Error("Task already exists");
    }

    const task = await Tasks.insertOne({ taskName, taskCompleted: false });
    if (!task) {
        throw new Error("Invalid task data");
    }

    return await Tasks.findOne({ _id: task });
};

export const updateTaskById = async (taskId: string, taskData: UpdateTaskReq) => {
    if (!Bson.ObjectId.isValid(taskId)) {
        throw new Error("Invalid task ID");
    }

    const { taskName, taskCompleted }: UpdateTaskReq = taskData;

    const filter = { _id: new Bson.ObjectId(taskId) };
    const update = { $set: { taskName, taskCompleted } };

    const Tasks = await getTasksCollection();
    const result = await Tasks.updateOne(filter, update);

    if (result.matchedCount === 0) {
        throw new Error('Task not found');
    }

    return getTaskById(taskId);
};

export const deleteAllTasks = async () => {
    const Tasks = await getTasksCollection();
    const deleteCount = await Tasks.deleteMany({});

    if (deleteCount === 0) {
        // throw new Error('No tasks found to delete');
    }

    return deleteCount;
}

export const deleteTaskById = async (taskId: string) => {
    if (!Bson.ObjectId.isValid(taskId)) {
        throw new Error("Invalid task ID");
    }

    const Tasks = await getTasksCollection();
    const deleteCount = await Tasks.deleteOne({ _id: new Bson.ObjectId(taskId) });

    if (deleteCount === 0) {
        throw new Error('Task not found');
    }

    return deleteCount;
}


