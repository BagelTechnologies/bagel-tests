# Full-Stack Home Test Submission

## What I Built
<!-- Provide a brief summary of what you implemented -->

### Frontend Features
- [ ] Task list with loading states
- [ ] Task creation form
- [ ] Task status toggle (open/done)
- [ ] Task editing functionality
- [ ] Task deletion with confirmation
- [ ] React Query for data management
- [ ] Optimistic updates
- [ ] Error handling and notifications

### Backend Features
- [ ] GET /api/tasks - List all tasks
- [ ] POST /api/tasks - Create new task
- [ ] PATCH /api/tasks/:id - Update task
- [ ] DELETE /api/tasks/:id - Delete task
- [ ] Input validation with Zod
- [ ] MongoDB integration
- [ ] Error handling middleware
- [ ] Health check endpoint

### Database
- [ ] MongoDB schema with validation
- [ ] Proper indexing
- [ ] Connection handling
- [ ] Sample data seeding

## How to Test
<!-- Instructions for running and testing your implementation -->

### Setup
```bash
# Install dependencies
npm run setup

# Start with Docker (recommended)
docker-compose up -d
npm run dev

# OR start manually
# Terminal 1: Start MongoDB
docker run -d --name mongo-test -p 27017:27017 mongo:7

# Terminal 2: Start backend
cd starter/backend && npm run dev

# Terminal 3: Start frontend
cd starter/frontend && npm run dev
```

### Testing Checklist
- [ ] Create a new task
- [ ] Mark task as done/open
- [ ] Edit task title
- [ ] Delete task
- [ ] Check error handling (try invalid data)
- [ ] Verify optimistic updates work
- [ ] Test with network disabled

## Key Decisions & Tradeoffs

### Architecture
<!-- Explain your architectural choices -->

### Libraries & Tools
<!-- Why did you choose specific libraries? -->

### Data Flow
<!-- How does data flow through your application? -->

### Error Handling
<!-- How do you handle errors and edge cases? -->

## What I'd Improve with More Time

### Performance
- [ ] Implement pagination for large task lists
- [ ] Add virtual scrolling
- [ ] Optimize bundle size
- [ ] Add service worker for offline support

### Features
- [ ] Task categories/tags
- [ ] Due dates and reminders
- [ ] Task search and filtering
- [ ] Bulk operations
- [ ] Task reordering (drag & drop)

### Code Quality
- [ ] Add comprehensive tests (unit, integration, e2e)
- [ ] Implement proper logging
- [ ] Add API documentation (Swagger)
- [ ] Set up CI/CD pipeline
- [ ] Add performance monitoring

### Security
- [ ] Input sanitization
- [ ] Rate limiting
- [ ] Authentication & authorization
- [ ] CSRF protection

## Technical Highlights
<!-- What are you most proud of in your implementation? -->

## Questions & Assumptions
<!-- Any questions about requirements or assumptions you made -->

---

**Time Spent:** ~X hours
**Most Challenging Part:** 
**Most Enjoyable Part:** 

## Screenshots (Optional)
<!-- Add screenshots of your UI if you'd like -->

