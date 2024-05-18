import { MongoClient, Database } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

import { APP_DATABASE_NAME, APP_DATABASE_URI } from "../utils/bootstrap.ts";

let client: MongoClient | null = null;
let db: Database | null = null;

export const connectDB = async () => {
    if (client && db) {
        return { client, db };
    }

    client = new MongoClient();
    
    await client.connect(APP_DATABASE_URI);
    db = client.database(APP_DATABASE_NAME);

    console.log("Connected to MongoDB");

    return { client, db };
}

export const getDb = () => {
    if (!db) {
        throw new Error("Database connection failed");
    }
    return db;
}
