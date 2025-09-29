# 🥯 Task 3 — Service Layer Implementation

## Welcome to Bagel's Business Logic Challenge!
**Important**: The MongoDB setup is complete! Your job is implementing the service layer business logic.

## What's Already Done ✅
- **✅ MongoDB Schema**: Task model with validation (`src/database/index.ts`)
- **✅ Database Connection**: Robust MongoDB connection with fallbacks
- **✅ Data Access Layer**: Complete CRUD operations in `src/tasks/data.ts`
- **✅ Docker Setup**: MongoDB container ready to go
- **✅ Indexing**: Performance indexes configured

## Your Mission 🔨
**Focus on Service Layer Logic** - The database is ready, implement the business rules:

### Core Implementation (Required)
- **🔨 `createTask()`** - Add input validation and business rules
- **🔨 `updateTask()`** - Validate updates and handle business logic  
- **🔨 `deleteTask()`** - Implement deletion with proper error handling
- **🔨 `getTaskById()`** - Single task retrieval (bonus)

### Key Points
- ✅ **Database Layer**: `TaskData` class has all MongoDB operations ready
- 🔨 **Your Job**: Add validation, error handling, and business logic
- 📝 **Follow TODO Hints**: Step-by-step guidance in `src/tasks/services.ts`
- 🎯 **Focus**: Business logic, not database setup

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

## 🧪 Testing Your Implementation

### Service Layer Testing (Recommended)

Create tests for your service layer implementation:

```typescript
// tests/taskService.test.ts
import { TaskServices } from '../src/tasks/services';
import { TaskData } from '../src/tasks/data';

// Mock the data layer
jest.mock('../src/tasks/data');
const MockTaskData = TaskData as jest.MockedClass<typeof TaskData>;

describe('TaskServices', () => {
  let taskServices: TaskServices;
  let mockTaskData: jest.Mocked<TaskData>;

  beforeEach(() => {
    MockTaskData.mockClear();
    taskServices = new TaskServices();
    mockTaskData = MockTaskData.mock.instances[0] as jest.Mocked<TaskData>;
  });

  describe('createTask', () => {
    it('should create task with valid title', async () => {
      // Arrange
      const input = { title: 'Test task' };
      const mockTask = {
        _id: 'mock-id',
        title: 'Test task',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockTaskData.create.mockResolvedValue(mockTask as any);

      // Act
      const result = await taskServices.createTask(input);

      // Assert
      expect(mockTaskData.create).toHaveBeenCalledWith({ title: 'Test task' });
      expect(result.title).toBe('Test task');
      expect(result.id).toBe('mock-id');
    });

    it('should throw error for empty title', async () => {
      // Arrange
      const input = { title: '   ' };

      // Act & Assert
      await expect(taskServices.createTask(input))
        .rejects.toThrow('Title cannot be empty');
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      // Arrange
      const id = 'mock-id';
      const updates = { status: 'done' as const };
      const mockUpdatedTask = {
        _id: id,
        title: 'Test task',
        status: 'done',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockTaskData.updateById.mockResolvedValue(mockUpdatedTask as any);

      // Act
      const result = await taskServices.updateTask(id, updates);

      // Assert
      expect(mockTaskData.updateById).toHaveBeenCalledWith(id, updates);
      expect(result.status).toBe('done');
    });

    it('should throw error when task not found', async () => {
      // Arrange
      mockTaskData.updateById.mockResolvedValue(null);

      // Act & Assert
      await expect(taskServices.updateTask('invalid-id', { status: 'done' }))
        .rejects.toThrow('Task not found');
    });
  });
});
```

### Integration Testing (Bonus)

Test the full stack with real MongoDB:

```typescript
// tests/integration/tasks.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../src/app';

describe('Tasks API Integration', () => {
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
    // Clear database before each test
    await mongoose.connection.db.dropDatabase();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = { title: 'Integration test task' };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.status).toBe('open');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('validation');
    });
  });
});
```

### Quick Test Setup

Add to `package.json`:
```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "mongodb-memory-server": "^8.0.0",
    "supertest": "^6.0.0",
    "@types/supertest": "^2.0.0"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Testing Strategy

1. **Start with Service Layer**: Test business logic in isolation
2. **Mock Dependencies**: Use mocks for data layer to focus on logic
3. **Test Edge Cases**: Empty inputs, invalid IDs, not found scenarios
4. **Integration Tests**: Test the full request/response cycle (bonus)

### What to Test

- ✅ **Input Validation**: Empty titles, invalid data
- ✅ **Business Logic**: Title trimming, status validation
- ✅ **Error Handling**: Not found, validation errors
- ✅ **Success Cases**: Valid operations return expected data

## Expected Outcome
A robust database layer that:
- Handles all CRUD operations efficiently
- Validates data at the schema level
- Uses appropriate indexes for performance
- Manages connections reliably
- Provides clear error messages
- Supports future scaling needs

