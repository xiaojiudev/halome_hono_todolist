import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/deps.ts";

export interface TaskSchema {
    _id: ObjectId;
    taskName: string;
    taskCompleted: boolean;
}

const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");
const db = client.database("hono_todolist");
const Tasks = db.collection<TaskSchema>("task");

export default Tasks;