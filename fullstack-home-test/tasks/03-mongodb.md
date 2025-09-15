# 🥯 Task 3 — MongoDB Integration

## Welcome to Bagel's Database Challenge!
The MongoDB integration is already set up - focus on implementing the business logic that uses it.

## What's Already Done ✅
- **Schema Design**: Task model with proper validation
- **Connection Management**: Robust MongoDB connection with fallbacks
- **Indexing**: Performance indexes already configured
- **Data Layer**: Complete data access layer in `src/tasks/data.ts`
- **Docker Setup**: MongoDB container ready to go

## Your Focus 🔨
Since the database layer is complete, your job is to:
- **Implement Service Layer**: Complete the business logic in `src/tasks/services.ts`
  - `createTask()` - Add validation and call data layer
  - `updateTask()` - Validate updates and call data layer  
  - `deleteTask()` - Handle deletion logic
  - `getTaskById()` - Retrieve single task (bonus)
- **Use Existing Data Layer**: The `TaskData` class has all CRUD operations ready
- **Follow TODO Hints**: Clear step-by-step guidance in the code

### MongoDB Setup Options

#### Option 1: Docker (Recommended)
```bash
# Using docker-compose (provided)
docker-compose up -d mongo

# Or standalone container
docker run -d --name mongo-test -p 27017:27017 mongo:7
```

#### Option 2: MongoDB Atlas (Cloud)
```typescript
// Connection string for Atlas
const connectionString = "mongodb+srv://username:password@cluster.mongodb.net/hometestdb";
```

#### Option 3: Local Installation
```bash
# macOS
brew install mongodb-community

# Ubuntu
sudo apt install mongodb

# Start service
mongod --dbpath /path/to/data
```

## Implementation Guide

### 1. Schema Design

```typescript
// models/Task.ts
import { Schema, model, Document } from 'mongoose';

interface ITask extends Document {
  title: string;
  status: 'open' | 'done';
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'done'],
      message: 'Status must be either open or done'
    },
    default: 'open'
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const Task = model<ITask>('Task', taskSchema);
```

### 2. Database Connection

```typescript
// utils/database.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/hometestdb';
    
    await mongoose.connect(connectionString, {
      // Connection options
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export default connectDB;
```

### 3. Indexing Strategy

```typescript
// Add indexes for performance
taskSchema.index({ createdAt: -1 }); // Sort by creation date (newest first)
taskSchema.index({ status: 1 }); // Filter by status
taskSchema.index({ title: 'text' }); // Text search on title (bonus)

// Compound index for complex queries (bonus)
taskSchema.index({ status: 1, createdAt: -1 });
```

### 4. Service Layer

```typescript
// services/taskService.ts
import { Task } from '../models/Task';
import { Types } from 'mongoose';

export class TaskService {
  async getAllTasks() {
    return await Task.find({}).sort({ createdAt: -1 });
  }

  async createTask(title: string) {
    const task = new Task({ title });
    return await task.save();
  }

  async updateTask(id: string, updates: Partial<{ title: string; status: 'open' | 'done' }>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid task ID');
    }

    const task = await Task.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  async deleteTask(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid task ID');
    }

    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  async getTaskById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid task ID');
    }

    const task = await Task.findById(id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }
}
```

### 5. Environment Configuration

```bash
# .env file
MONGODB_URI=mongodb://localhost:27017/hometestdb
NODE_ENV=development
PORT=4000

# For production/Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hometestdb
```

## Advanced Features (Bonus)

### 1. Data Seeding
```typescript
// utils/seed.ts
const seedTasks = async () => {
  const count = await Task.countDocuments();
  
  if (count === 0) {
    const sampleTasks = [
      { title: 'Complete the home test', status: 'open' },
      { title: 'Review React Query documentation', status: 'done' },
      { title: 'Set up MongoDB indexes', status: 'open' }
    ];

    await Task.insertMany(sampleTasks);
    console.log('Sample tasks created');
  }
};
```

### 2. Aggregation Queries
```typescript
// Get task statistics
async getTaskStats() {
  return await Task.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
}
```

### 3. Soft Delete (Alternative to hard delete)
```typescript
// Add to schema
const taskSchema = new Schema({
  // ... other fields
  deletedAt: {
    type: Date,
    default: null
  }
});

// Soft delete method
taskSchema.methods.softDelete = function() {
  this.deletedAt = new Date();
  return this.save();
};

// Query helper to exclude deleted
taskSchema.query.active = function() {
  return this.where({ deletedAt: null });
};
```

## Performance Optimization

### 1. Connection Pooling
- Configure appropriate pool size based on expected load
- Monitor connection usage

### 2. Query Optimization
- Use `lean()` for read-only queries
- Project only needed fields
- Use appropriate indexes

### 3. Monitoring
- Log slow queries
- Monitor database performance
- Set up alerts for connection issues

## Testing Database Layer

```typescript
// tests/database.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Task } from '../models/Task';

describe('Task Model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  it('should create a task with valid data', async () => {
    const taskData = { title: 'Test task' };
    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask.title).toBe(taskData.title);
    expect(savedTask.status).toBe('open');
    expect(savedTask.createdAt).toBeDefined();
  });

  // More tests...
});
```

## Expected Outcome
A robust database layer that:
- Handles all CRUD operations efficiently
- Validates data at the schema level
- Uses appropriate indexes for performance
- Manages connections reliably
- Provides clear error messages
- Supports future scaling needs

