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

## 🧪 Testing Your Implementation (Bonus)

### Testing React Query Hooks

```typescript
// tests/hooks/useTasks.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateTask, useTasks } from '../../src/hooks/useTasks';
import { taskApi } from '../../src/lib/api';

// Mock the API
jest.mock('../../src/lib/api');
const mockTaskApi = taskApi as jest.Mocked<typeof taskApi>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch tasks successfully', async () => {
    // Arrange
    const mockTasks = [
      { id: '1', title: 'Test task', status: 'open', createdAt: '2023-01-01T00:00:00Z' }
    ];
    mockTaskApi.getTasks.mockResolvedValue(mockTasks);

    // Act
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(mockTasks);
  });

  it('should handle loading state', () => {
    // Arrange
    mockTaskApi.getTasks.mockImplementation(() => new Promise(() => {})); // Never resolves

    // Act
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});

describe('useCreateTask', () => {
  it('should create task with optimistic updates', async () => {
    // Arrange
    const newTask = { title: 'New task' };
    const createdTask = { 
      id: '2', 
      title: 'New task', 
      status: 'open', 
      createdAt: '2023-01-01T00:00:00Z' 
    };
    mockTaskApi.createTask.mockResolvedValue(createdTask);

    // Act
    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newTask);

    // Assert
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(mockTaskApi.createTask).toHaveBeenCalledWith(newTask);
  });
});
```

### Testing Components with React Query

```typescript
// tests/components/TaskForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskForm } from '../../src/components/TaskForm';
import { taskApi } from '../../src/lib/api';

jest.mock('../../src/lib/api');
const mockTaskApi = taskApi as jest.Mocked<typeof taskApi>;

const renderWithQuery = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('TaskForm', () => {
  it('should create task on form submission', async () => {
    // Arrange
    const mockTask = { 
      id: '1', 
      title: 'Test task', 
      status: 'open', 
      createdAt: '2023-01-01T00:00:00Z' 
    };
    mockTaskApi.createTask.mockResolvedValue(mockTask);

    renderWithQuery(<TaskForm />);

    // Act
    const input = screen.getByPlaceholderText(/task title/i);
    const submitButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(input, { target: { value: 'Test task' } });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockTaskApi.createTask).toHaveBeenCalledWith({ title: 'Test task' });
    });
  });

  it('should show validation error for empty title', async () => {
    renderWithQuery(<TaskForm />);

    // Act
    const submitButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Strategy
1. **Mock API calls**: Use `jest.mock()` to control API responses
2. **Test loading states**: Verify UI shows loading indicators
3. **Test error handling**: Simulate API failures and check error display
4. **Test optimistic updates**: Verify UI updates immediately before API response
5. **Test form validation**: Check client-side validation works correctly

## Expected Outcome
A responsive task management interface that:
- Loads quickly with proper caching
- Provides immediate feedback for user actions
- Handles network errors gracefully
- Updates the UI optimistically for better UX

