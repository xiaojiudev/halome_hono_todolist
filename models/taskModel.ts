import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/deps.ts";
import { Collection } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

import { getDb } from "./db.ts";
export interface TaskSchema {
    _id: ObjectId;
    taskName: string;
    taskCompleted: boolean;
}

let tasksCollection: Collection<TaskSchema> | null = null;

export const getTasksCollection = async () => {
    if (tasksCollection) return tasksCollection;

    const db = await getDb();
    tasksCollection = db.collection<TaskSchema>("task");
    return tasksCollection;
};
