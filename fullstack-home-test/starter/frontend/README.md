# 🥯 Bagel Frontend - Your Task

A React frontend starter for the Bagel Full-Stack Developer Assessment, built with TypeScript, React Query, and Mantine UI.

## 🎯 What You Need to Implement

**Already Working:**
- ✅ Task list display with Mantine UI
- ✅ GET tasks API call (loads empty list)
- ✅ GET stats API call (shows statistics)
- ✅ React Query setup and configuration
- ✅ Error boundaries and loading states

**Your Mission (follow the TODO hints!):**
- 🔨 **API Client** - Implement createTask, updateTask, deleteTask in `api.ts`
- 🔨 **Optimistic Updates** - Make the UI feel instant with React Query
- 🔨 **Form Validation** - Validate task creation properly  
- 🔨 **Error Handling** - Handle API errors gracefully

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

The app will be available at `http://localhost:5173`

## 📋 Implementation Guide

### 1. Follow the TODO Comments
Look for `TODO:` comments in these files:
- `src/lib/api.ts` - **Implement API calls** (createTask, updateTask, deleteTask)
- `src/hooks/useTasks.ts` - **Implement optimistic updates** for React Query
- `src/components/TaskForm.tsx` - **Add form validation** and error handling

### 2. API Client Implementation (Step 1)
First, implement the missing API calls in `src/lib/api.ts`:

```typescript
// Example: Implement createTask
createTask: async (input: CreateTaskInput): Promise<Task> => {
  const response = await api.post<ApiResponse<Task>>('/tasks', input)
  return response.data.data!
},
```

You need to implement:
- `createTask` - POST request to `/tasks`
- `updateTask` - PATCH request to `/tasks/${id}`  
- `deleteTask` - DELETE request to `/tasks/${id}`

### 3. React Query Optimistic Updates (Step 2)
The patterns you need to implement:

```typescript
// In useTasks.ts - implement optimistic updates like this:
onMutate: async (newTask) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: queryKeys.tasksList() })
  
  // Snapshot previous value
  const previousTasks = queryClient.getQueryData(queryKeys.tasksList())
  
  // Optimistically update
  queryClient.setQueryData(queryKeys.tasksList(), (old) => 
    old ? [optimisticTask, ...old] : [optimisticTask]
  )
  
  return { previousTasks }
},
onError: (err, newTask, context) => {
  // Rollback on error
  queryClient.setQueryData(queryKeys.tasksList(), context?.previousTasks)
},
onSettled: () => {
  // Refetch to sync with server
  queryClient.invalidateQueries({ queryKey: queryKeys.tasksList() })
}
```

### 3. Form Validation
Implement proper validation in `TaskForm.tsx`:

```typescript
validate: {
  title: (value) => {
    const trimmed = value.trim()
    if (!trimmed) return 'Title is required'
    if (trimmed.length > 200) return 'Title cannot exceed 200 characters'
    return null
  },
}
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── TaskManager.tsx  # ✅ Main container (working)
│   ├── TaskForm.tsx     # 🔨 Form validation (YOUR WORK!)
│   ├── TaskList.tsx     # ✅ Task list display (working)
│   ├── TaskItem.tsx     # ✅ Individual task item (working)
│   ├── TaskStats.tsx    # ✅ Statistics display (working)
│   └── ErrorBoundary.tsx # ✅ Error handling (working)
├── hooks/              # Custom React hooks
│   └── useTasks.ts     # 🔨 Optimistic updates (YOUR WORK!)
├── lib/                # Utilities
│   ├── api.ts          # ✅ API client (working)
│   └── queryKeys.ts    # ✅ React Query keys (working)
├── types/              # TypeScript types
│   └── task.ts         # ✅ Task types (already defined)
├── App.tsx             # ✅ Main app component (working)
└── main.tsx           # ✅ App entry point (working)
```

## 💡 Tips for Success

1. **Start with optimistic updates** - implement `useCreateTask` first
2. **Follow the existing patterns** - look at how `useTasks` works
3. **Use the TODO hints** - they guide you step by step
4. **Test in the browser** - see your changes immediately
5. **Handle edge cases** - what happens when the API fails?

## 🎯 What Bagel is Looking For

- **React Query mastery** - proper optimistic updates implementation
- **Form handling** - validation, error states, user experience
- **Error handling** - graceful handling of API failures
- **Code quality** - clean, readable React patterns
- **User experience** - smooth, responsive interactions

## 🔧 Key Features Already Set Up

### Mantine UI Components
- Modern, accessible component library
- Consistent styling and theming
- Form components with built-in validation support

### React Query Configuration
- Proper query client setup
- Error boundaries integration
- Devtools enabled in development

### Error Handling Infrastructure
- Error boundaries for component errors
- Toast notifications for user feedback
- Loading states throughout the app

## 🌟 Bonus Features (If You Have Time)

- **Better animations** - smooth transitions for optimistic updates
- **Keyboard shortcuts** - enhance accessibility
- **Loading indicators** - show progress for longer operations
- **Empty states** - improve UX when no tasks exist

**The foundation is solid - now make it shine!** 🚀