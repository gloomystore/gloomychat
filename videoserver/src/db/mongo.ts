import { Db, MongoClient, MongoClientOptions } from 'mongodb';
require('dotenv').config();
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dbName = process.env.DB;
const user = process.env.DB_USER;
const pass = process.env.DB_PASSWORD as string;

if (!host || !port || !dbName || !user || !pass) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  );
}


let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDatabase(): Promise<{ client: MongoClient, db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(`mongodb://${user}:${encodeURIComponent(pass)}@${host}:${port}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as MongoClientOptions);

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}