import mongoose from 'mongoose';
import { ITask } from '../types/index.js';

// Task Schema
const taskSchema = new mongoose.Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'done'],
      message: 'Status must be either open or done',
    },
    default: 'open',
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      (ret as any).id = ret._id.toString();
      delete (ret as any)._id;
      delete (ret as any).__v;
      return ret;
    },
  },
});

// Indexes for better performance
taskSchema.index({ createdAt: -1 }); // Sort by creation date (newest first)
taskSchema.index({ status: 1 }); // Filter by status
taskSchema.index({ status: 1, createdAt: -1 }); // Compound index

export const Task = mongoose.model<ITask>('Task', taskSchema);

// Database connection
export const connectDB = async (): Promise<void> => {
  try {
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/hometestdb';
    
    await mongoose.connect(connectionString, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`📊 MongoDB connected: ${connectionString}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('📊 MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('📊 MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📊 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

