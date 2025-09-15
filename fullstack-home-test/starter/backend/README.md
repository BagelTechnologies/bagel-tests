# 🥯 Bagel Backend API - Your Task

A Node.js Express API starter for the Bagel Full-Stack Developer Assessment.

## 🎯 What You Need to Implement

**Already Working:**
- ✅ `GET /api/tasks` - Returns all tasks
- ✅ `GET /api/tasks/stats` - Returns task statistics  
- ✅ `GET /api/health` - Health check endpoint

**Your Mission (follow the TODO hints!):**
- 🔨 `POST /api/tasks` - Create a new task
- 🔨 `PATCH /api/tasks/:id` - Update a task
- 🔨 `DELETE /api/tasks/:id` - Delete a task
- 🔨 `GET /api/tasks/:id` - Get a specific task

## 🚀 Quick Start

### Using Bagel CLI (Recommended)
```bash
# From project root
./bagel-test.sh up
```

### Manual Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The API will be available at `http://localhost:4000`

## 📋 Implementation Guide

### 1. Follow the TODO Comments
Look for `TODO:` comments in these files:
- `src/tasks/index.ts` - Route handlers
- `src/tasks/services.ts` - Business logic
- `src/tasks/data.ts` - Database operations (already implemented)

### 2. Use the Existing Patterns
- Error handling is already set up
- Validation schemas are already defined
- Database connection handles MongoDB + fallback

### 3. Test Your Work
```bash
# Test GET (already works)
curl http://localhost:4000/api/tasks

# Test your POST implementation
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My test task"}'
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript for production
- `npm run start` - Start production server
- `npm run lint` - Lint code

## 📁 Project Structure

```
src/
├── index.ts              # Application entry point
├── app.ts                # Express app configuration  
├── database/             # MongoDB connection
├── types/                # TypeScript types (already defined)
├── tasks/                # Task-related code (YOUR WORK HERE!)
│   ├── index.ts          # 🔨 Routes - implement TODO endpoints
│   ├── services.ts       # 🔨 Business logic - implement TODO methods
│   └── data.ts           # ✅ Database layer - already implemented
└── health/               # Health check (already working)
```

## 💡 Tips for Success

1. **Start with POST** - implement task creation first
2. **Follow the patterns** - look at the working GET endpoint
3. **Use the hints** - TODO comments guide you step by step
4. **Test frequently** - use curl or browser to verify your work
5. **Handle errors** - the framework is set up, just follow the patterns

## 🎯 What Bagel is Looking For

- **Clean code** - readable, well-structured implementations
- **Error handling** - proper validation and error responses
- **TypeScript usage** - leverage the existing type definitions
- **Following patterns** - consistency with the existing codebase
- **Testing mindset** - verify your implementations work

## 🔧 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Complete home test",
    "status": "open",
    "createdAt": "2025-09-15T10:30:00.000Z",
    "updatedAt": "2025-09-15T10:30:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Task not found"
}
```

**Good luck! The TODO comments are your roadmap to success.** 🚀