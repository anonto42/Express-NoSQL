import mongoose from 'mongoose';
import config from '../config';
import { logger } from '../shared/logger';

class Database {
  private static instance: Database;
  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      const mongoUri = config.mongo_uri || `mongodb://localhost:${config.database_port}/${config.database_name}`;
      await mongoose.connect(mongoUri);
      logger.info('🚀 MongoDB connected successfully');
    } catch (err) {
      logger.error('❌ MongoDB connection failed', err);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  }
}

export default Database.getInstance();
