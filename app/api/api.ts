// diary\app\api\api.ts

import { MongoClient, ObjectId } from "mongodb";
import { connectDB } from "../database";

async function fetchData() {
    const client: MongoClient = await connectDB;
    const db = client.db("diary");
    const result = await db.collection('today').find().toArray();
    return JSON.parse(JSON.stringify(result));
}

async function updateData(id: string, data: { emoji: string, title: string, content: string }) {
    const client: MongoClient = await connectDB;
    const db = client.db("diary");

    const result = await db.collection('today').updateOne(
        { _id: new ObjectId(id) }, // MongoDB의 ObjectId로 변환해야 합니다.
        { $set: data }
    );

    console.log('Data updated successfully:', result);

    return result;
}

export { fetchData, updateData };
