//database.ts

import { MongoClient } from 'mongodb';

const url: string = 'mongodb+srv://gmlwls0425107:qnfpd107@diary.ul8lbra.mongodb.net/?retryWrites=true&w=majority&appName=diary';
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