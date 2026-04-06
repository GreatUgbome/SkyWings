import * as dotenv from 'dotenv';
dotenv.config();

import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export const initializeDatabase = async (): Promise<Db> => {
  if (db) return db;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB_NAME || 'skywings';

  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(dbName);

    // Verify connection
    await db.admin().ping();
    console.log('✓ Connected to MongoDB:', dbName);

    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const getDatabase = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first');
  }
  return db;
};

export const closeDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✓ Disconnected from MongoDB');
  }
};

export { MongoClient };
