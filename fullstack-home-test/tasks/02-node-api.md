# 🥯 Task 2 — Node.js API Implementation

## Welcome to Bagel's Backend Challenge!
Complete the REST API implementation using Node.js, TypeScript, and Express with MongoDB.

## What's Already Done ✅
- **Project Structure**: Clean, organized codebase with proper separation
- **Database Setup**: MongoDB connection with Mongoose schemas  
- **TypeScript Configuration**: Full type safety setup
- **Middleware**: CORS, error handling, request logging
- **GET Endpoints**: `GET /api/tasks` and `GET /api/health` are working

## Your Mission 🔨
- **POST /api/tasks**: Implement task creation endpoint
- **PATCH /api/tasks/:id**: Implement task update endpoint  
- **DELETE /api/tasks/:id**: Implement task deletion endpoint
- **GET /api/tasks/:id**: Implement get single task endpoint (bonus)

### Implementation Requirements
- ✅ **TypeScript**: Already configured with proper types
- 🔨 **Validation**: Use existing Zod schemas for input validation
- ✅ **Error Handling**: Middleware already set up
- ✅ **CORS**: Already configured for frontend
- 🔨 **Business Logic**: Follow the existing patterns in services layer
- ✅ **MongoDB**: Database integration with Mongoose

## Implementation Guide

### 1. Project Structure
```
backend/src/
├── index.ts              # App entry point
├── app.ts                # Express app configuration
├── routes/
│   └── tasks.ts          # Task routes
├── controllers/
│   └── taskController.ts # Request handlers
├── services/
│   └── taskService.ts    # Business logic
├── models/
│   └── Task.ts           # MongoDB schema
├── middleware/
│   ├── errorHandler.ts   # Error handling
│   └── validation.ts     # Request validation
├── types/
│   └── Task.ts           # TypeScript types
└── utils/
    ├── database.ts       # DB connection
    └── logger.ts         # Logging utility
```

### 2. Data Model
```typescript
interface Task {
  _id: string;
  title: string;
  status: 'open' | 'done';
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. API Specifications

#### GET /api/tasks
```typescript
// Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Complete home test",
      "status": "open",
      "createdAt": "2025-09-15T10:30:00.000Z"
    }
  ]
}
```

#### POST /api/tasks
```typescript
// Request body
{
  "title": "New task title"
}

// Response: 201 Created
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "New task title",
    "status": "open",
    "createdAt": "2025-09-15T10:30:00.000Z"
  }
}
```

#### PATCH /api/tasks/:id
```typescript
// Request body (partial update)
{
  "status": "done",
  "title": "Updated title" // optional
}

// Response: 200 OK
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated title",
    "status": "done",
    "createdAt": "2025-09-15T10:30:00.000Z"
  }
}
```

### 4. Validation Rules
- **Title**: Required, string, 1-200 characters, trimmed
- **Status**: Optional, enum ('open' | 'done')
- **ID**: Valid MongoDB ObjectId format

### 5. Error Responses
```typescript
// 400 Bad Request
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}

// 404 Not Found
{
  "success": false,
  "error": "Task not found"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Internal server error"
}
```

## Advanced Features (Bonus)
- ✨ **Pagination**: Add limit/offset query parameters
- ✨ **Filtering**: Filter by status, date range
- ✨ **Sorting**: Sort by createdAt, title, status
- ✨ **Rate Limiting**: Prevent abuse
- ✨ **Authentication**: JWT-based auth (if implementing users)
- ✨ **API Documentation**: OpenAPI/Swagger docs
- ✨ **Caching**: Redis for frequently accessed data
- ✨ **Database Migrations**: Schema versioning

## 🧪 Testing Your API Implementation (Bonus)

### API Endpoint Testing

```typescript
// tests/api/tasks.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { TaskServices } from '../../src/tasks/services';

// Mock the service layer
jest.mock('../../src/tasks/services');
const MockTaskServices = TaskServices as jest.MockedClass<typeof TaskServices>;

describe('Tasks API', () => {
  let mockTaskServices: jest.Mocked<TaskServices>;

  beforeEach(() => {
    MockTaskServices.mockClear();
    mockTaskServices = MockTaskServices.mock.instances[0] as jest.Mocked<TaskServices>;
  });

  describe('POST /api/tasks', () => {
    it('should create task successfully', async () => {
      // Arrange
      const taskData = { title: 'Test task' };
      const createdTask = {
        id: '1',
        title: 'Test task',
        status: 'open',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      mockTaskServices.createTask.mockResolvedValue(createdTask);

      // Act & Assert
      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        data: createdTask
      });
      expect(mockTaskServices.createTask).toHaveBeenCalledWith(taskData);
    });

    it('should validate required title field', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('validation');
    });

    it('should handle service errors', async () => {
      // Arrange
      mockTaskServices.createTask.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await request(app)
        .post('/api/tasks')
        .send({ title: 'Test task' })
        .expect(500);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should update task successfully', async () => {
      // Arrange
      const taskId = '507f1f77bcf86cd799439011';
      const updates = { status: 'done' as const };
      const updatedTask = {
        id: taskId,
        title: 'Test task',
        status: 'done',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      mockTaskServices.updateTask.mockResolvedValue(updatedTask);

      // Act & Assert
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send(updates)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: updatedTask
      });
      expect(mockTaskServices.updateTask).toHaveBeenCalledWith(taskId, updates);
    });

    it('should return 404 for non-existent task', async () => {
      // Arrange
      const taskId = '507f1f77bcf86cd799439011';
      mockTaskServices.updateTask.mockRejectedValue(new Error('Task not found'));

      // Act & Assert
      await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ status: 'done' })
        .expect(404);
    });

    it('should validate MongoDB ObjectId format', async () => {
      const response = await request(app)
        .patch('/api/tasks/invalid-id')
        .send({ status: 'done' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task successfully', async () => {
      // Arrange
      const taskId = '507f1f77bcf86cd799439011';
      mockTaskServices.deleteTask.mockResolvedValue();

      // Act & Assert
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(204);

      expect(mockTaskServices.deleteTask).toHaveBeenCalledWith(taskId);
    });

    it('should return 404 for non-existent task', async () => {
      // Arrange
      const taskId = '507f1f77bcf86cd799439011';
      mockTaskServices.deleteTask.mockRejectedValue(new Error('Task not found'));

      // Act & Assert
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(404);
    });
  });
});
```

### Validation Testing

```typescript
// tests/validation/taskValidation.test.ts
import { CreateTaskSchema, UpdateTaskSchema } from '../../src/types';

describe('Task Validation', () => {
  describe('CreateTaskSchema', () => {
    it('should accept valid task creation data', () => {
      const validData = { title: 'Valid task title' };
      const result = CreateTaskSchema.safeParse(validData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject empty title', () => {
      const invalidData = { title: '' };
      const result = CreateTaskSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should trim whitespace from title', () => {
      const dataWithWhitespace = { title: '  Trimmed title  ' };
      const result = CreateTaskSchema.safeParse(dataWithWhitespace);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Trimmed title');
      }
    });

    it('should reject title longer than 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      const invalidData = { title: longTitle };
      const result = CreateTaskSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateTaskSchema', () => {
    it('should accept valid status update', () => {
      const validData = { status: 'done' as const };
      const result = UpdateTaskSchema.safeParse(validData);
      
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const invalidData = { status: 'invalid' };
      const result = UpdateTaskSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should accept partial updates', () => {
      const validData = { title: 'Updated title' };
      const result = UpdateTaskSchema.safeParse(validData);
      
      expect(result.success).toBe(true);
    });
  });
});
```

### Error Handling Testing

```typescript
// tests/middleware/errorHandler.test.ts
import request from 'supertest';
import express from 'express';
import { errorHandler } from '../../src/middleware/errorHandler';
import { ZodError } from 'zod';

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Test route that throws different types of errors
  app.get('/test-error/:type', (req, res, next) => {
    const { type } = req.params;
    
    switch (type) {
      case 'zod':
        const zodError = new ZodError([{
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['title'],
          message: 'Expected string, received number'
        }]);
        next(zodError);
        break;
      case 'not-found':
        next(new Error('Task not found'));
        break;
      default:
        next(new Error('Generic error'));
    }
  });
  
  app.use(errorHandler);
  return app;
};

describe('Error Handler Middleware', () => {
  const app = createTestApp();

  it('should handle Zod validation errors', async () => {
    const response = await request(app)
      .get('/test-error/zod')
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      error: 'Validation failed',
      details: expect.any(Array)
    });
  });

  it('should handle not found errors', async () => {
    const response = await request(app)
      .get('/test-error/not-found')
      .expect(404);

    expect(response.body).toMatchObject({
      success: false,
      error: 'Task not found'
    });
  });

  it('should handle generic errors', async () => {
    const response = await request(app)
      .get('/test-error/generic')
      .expect(500);

    expect(response.body).toMatchObject({
      success: false,
      error: 'Internal server error'
    });
  });
});
```

### Testing Strategy
1. **Unit Tests**: Test individual functions and middleware
2. **Integration Tests**: Test full request/response cycle
3. **Validation Tests**: Test all input validation scenarios
4. **Error Handling**: Test error responses and status codes
5. **Mock Dependencies**: Isolate the code being tested

## Code Quality Standards
- **Clean Architecture**: Separate concerns (routes → controllers → services → models)
- **Error Handling**: Try-catch blocks with meaningful error messages
- **Type Safety**: Comprehensive TypeScript types
- **Validation**: Use Zod or similar for runtime validation
- **Logging**: Structured logging with request IDs
- **Testing**: Unit tests for services and integration tests for endpoints

## Performance Considerations
- **Database Indexes**: Index on frequently queried fields
- **Connection Pooling**: Efficient MongoDB connections
- **Response Compression**: Gzip compression for responses
- **Request Size Limits**: Prevent large payload attacks

## Expected Outcome
A production-ready API that:
- Handles all CRUD operations efficiently
- Provides clear, consistent error messages
- Validates all inputs thoroughly
- Logs important events and errors
- Connects reliably to MongoDB
- Follows REST API best practices

