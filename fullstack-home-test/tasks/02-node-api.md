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

