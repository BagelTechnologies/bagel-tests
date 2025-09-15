# 🥯 Task 1 — React Query Implementation

## Welcome to Bagel's Frontend Challenge!
Implement React Query for efficient data fetching and state management in our task management app.

## What's Already Done ✅
- **Fetch Tasks**: Basic task list display is working
- **Loading States**: Mantine UI components with loading states
- **Error Handling**: Error boundaries and basic error display
- **UI Components**: Beautiful Mantine UI components ready to use

## Your Mission 🔨
- **API Client**: Implement `createTask`, `updateTask`, `deleteTask` in `src/lib/api.ts`
- **Optimistic Updates**: Add React Query optimistic updates in `src/hooks/useTasks.ts`
- **Form Validation**: Complete form validation in `src/components/TaskForm.tsx`
- **Error Handling**: Improve error handling throughout the app

### React Query Requirements
- ✅ **Query Keys**: Already set up with proper organization
- 🔨 **Cache Invalidation**: Implement in mutation callbacks
- 🔨 **Optimistic Updates**: Add to create/update/delete operations  
- 🔨 **Error Handling**: Rollback on mutation failures
- ✅ Handle loading and error states for all operations

## Implementation Guide

### 1. Setup React Query
```typescript
// Setup QueryClient with good defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

### 2. Query Keys Strategy
```typescript
// Consistent query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};
```

### 3. Custom Hooks
Create custom hooks for:
- `useTasksQuery()` - Fetch all tasks
- `useCreateTaskMutation()` - Create new task
- `useUpdateTaskMutation()` - Update task status/title
- `useDeleteTaskMutation()` - Delete task

### 4. UI Components
- **TaskList**: Display tasks with loading/error states
- **TaskForm**: Create new tasks with validation
- **TaskItem**: Individual task with toggle/delete actions
- **LoadingSpinner**: Reusable loading component
- **ErrorMessage**: Reusable error display

## Advanced Features (Bonus)
- ✨ **Infinite Queries**: For pagination if implementing large lists
- ✨ **Background Updates**: Refetch on window focus
- ✨ **Offline Support**: Show cached data when offline
- ✨ **Optimistic Updates**: For better perceived performance
- ✨ **Debounced Search**: If implementing search functionality

## Testing Considerations
- Test loading states
- Test error scenarios
- Test optimistic updates
- Mock API responses
- Test cache invalidation

## Expected Outcome
A responsive task management interface that:
- Loads quickly with proper caching
- Provides immediate feedback for user actions
- Handles network errors gracefully
- Updates the UI optimistically for better UX

