# 🥯 Bagel Full-Stack Developer Assessment

## Welcome to Bagel!
You'll build a small task management feature end-to-end using the same modern technologies we use at Bagel:
- **Frontend:** React + TypeScript + **React Query**
- **Backend:** Node.js + TypeScript (Express)  
- **Database:** MongoDB (containerized with Docker)

**Time allocation: 3–4 hours** (focus on quality over completeness—we'd rather see well-crafted code than rushed features).

## 🎯 Your Mission
Build a task management system that showcases your skills in the areas we care about at Bagel:

1. **Backend API**: Complete the CRUD operations for `Task` entities
   - Implement POST, PATCH, DELETE endpoints (GET is already done!)
   - Follow the existing patterns and TODO hints in the code
   
2. **Frontend Excellence**: Enhance the React application
   - Implement **optimistic updates** with React Query
   - Add proper form validation and error handling
   - Polish the user experience with loading states
   
3. **Code Quality**: Show us your best practices
   - Clean, readable, maintainable code
   - Proper error handling and edge cases
   - TypeScript best practices

## 🚀 Quick Start

### Prerequisites
- Docker (for MongoDB)
- Node.js 18+
- Git

### One-Command Setup ⚡
```bash
# Clone the repo (you should have received the link from Bagel team)
git clone <repo-url>
cd fullstack-home-test

# Start everything with one command!
./bagel-test.sh up
```

**That's it!** The Bagel CLI will automatically:
- ✅ Start MongoDB in Docker container
- ✅ Install all dependencies
- ✅ Start backend API on port 4000
- ✅ Start frontend on port 5173
- ✅ Handle fallbacks if MongoDB fails

### Bagel CLI Commands
```bash
./bagel-test.sh up      # Start all services
./bagel-test.sh stop    # Stop all services  
./bagel-test.sh status  # Check service status
./bagel-test.sh help    # Show help
```

**Your development environment:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api  
- **MongoDB**: mongodb://localhost:27017

### If You Prefer Manual Setup
```bash
# Start MongoDB
docker run -d --name mongo-test -p 27017:27017 mongo:7

# Backend (Terminal 1)
cd starter/backend && npm install && npm run dev

# Frontend (Terminal 2)  
cd starter/frontend && npm install && npm run dev
```

## 📋 What You Need to Implement

### Backend Endpoints (follow the TODO hints!)
- ✅ `GET /api/tasks` → Already working! Returns task list
- 🔨 `POST /api/tasks` → **You implement this** (body: `{ title: string }`)
- 🔨 `PATCH /api/tasks/:id` → **You implement this** (body: `{ status?, title? }`)  
- 🔨 `DELETE /api/tasks/:id` → **You implement this**
- ✅ `GET /api/tasks/stats` → Already working! Returns statistics

### Frontend Features (follow the TODO hints!)
- ✅ Task list display → Already working!
- 🔨 **Optimistic updates** → **You implement this**
- 🔨 **Form validation** → **You implement this**
- 🔨 **Error handling** → **You implement this**

### Task Schema (Already Defined)
```typescript
interface Task {
  id: string
  title: string
  status: 'open' | 'done'
  createdAt: string // ISO date
  updatedAt: string // ISO date
}
```

## 🔧 Development Commands

### Bagel CLI (Recommended)
```bash
# Start everything
./bagel-test.sh up

# Stop all services
./bagel-test.sh stop

# Check service status
./bagel-test.sh status
```

### NPM Scripts (Alternative)
```bash
# Start all services together
npm run dev

# Or start individually
npm run dev:backend
npm run dev:frontend
```

## 📤 Submission Guidelines

1. **Work directly in this repository** (you should have been given access)
2. **Create a feature branch**: `feature/your-name` (e.g., `feature/john-doe`)
3. **Make meaningful commits** with clear messages
4. **Open a Pull Request** to `main` branch when complete
5. **Add a `NOTES.md`** in the root explaining:
   - Your approach and key decisions
   - What you'd improve with more time
   - Any assumptions you made
   - How to test your implementation

**Timeline**: Please submit within **3-4 hours** of receiving this assessment.

## 🎯 How Bagel Will Evaluate Your Work

| Category | What We're Looking For |
|----------|------------------------|
| **Backend Skills** | Clean API implementation, proper error handling, TypeScript usage |
| **Frontend Excellence** | React best practices, optimistic updates, user experience |
| **React Query Mastery** | Proper caching, optimistic updates, loading states |
| **Code Quality** | Clean, readable, maintainable code with good patterns |
| **Problem Solving** | How you handle edge cases and errors |
| **Communication** | Clear commits, good NOTES.md explaining your decisions |

## 🌟 Bonus Points (If You Have Time)
- **Testing**: Unit tests for your implementations
- **Polish**: Smooth animations, better UX
- **Error Boundaries**: React error boundaries
- **Performance**: Optimizations you think are important
- **Documentation**: Comments explaining complex logic

## 💡 Tips for Success
- **Start with the backend** - get the API endpoints working first
- **Follow the TODO hints** - they'll guide you to the right patterns
- **Focus on the core features** - don't get stuck on edge cases
- **Test as you go** - use the browser and curl to verify your work
- **Write clean, readable code** - we value quality over quantity

## 🛠️ Troubleshooting
- **Services won't start**: Use `./bagel-test.sh stop` then `./bagel-test.sh up`
- **Port conflicts**: Make sure ports 4000, 5173, and 27017 are free
- **Need help**: Check the TODO comments in the code for hints!

## 📁 Project Structure
```
fullstack-home-test/
├── 🥯 bagel-test.sh             # Bagel CLI - starts everything!
├── 📖 README.md                 # This file
├── 📝 NOTES.md                  # Your implementation notes (create this)
├── 📋 tasks/                    # Detailed task descriptions  
└── 🚀 starter/                  # Your playground
    ├── backend/                 # Node.js API (implement TODO endpoints)
    └── frontend/                # React UI (implement TODO features)
```

---

## 🥯 Welcome to the Bagel Team Assessment!

We're excited to see what you build! Remember:
- **Quality over quantity** - we'd rather see well-crafted code than rushed features
- **Communication matters** - your NOTES.md helps us understand your thinking
- **Ask questions if stuck** - the TODO comments are your guide
- **Have fun** - this is a chance to show your skills and creativity!

**Good luck, and welcome to the Bagel journey!** 🚀

