import mongoose from 'mongoose';
import { config } from './config';

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(config.DATABASE_URI!);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export { databaseConnection };
