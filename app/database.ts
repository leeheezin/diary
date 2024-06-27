//database.ts

import { MongoClient } from 'mongodb';

const url: string = process.env.MONGODB_URI || '';
let connectDB: Promise<MongoClient>;

declare global {
  var _mongo: Promise<MongoClient> | undefined;
}

async function initializeMongo() {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongo) {
      global._mongo = new MongoClient(url).connect();
    }
    connectDB = global._mongo;
  } else {
    connectDB = new MongoClient(url).connect();
  }
}

initializeMongo().catch(console.error);

export { connectDB };