import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'
import type { CreateTaskInput, UpdateTaskInput, Task } from '../types/task'

/**
 * Hook to fetch all tasks
 */
export const useTasks = () => {
  return useQuery({
    queryKey: queryKeys.tasksList(),
    queryFn: taskApi.getTasks,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to create a new task with optimistic updates
 * 
 * TODO: Implement optimistic updates for task creation
 * HINTS:
 * - Use onMutate to add optimistic task to cache
 * - Cancel outgoing queries with queryClient.cancelQueries
 * - Snapshot previous data for rollback
 * - Create optimistic task with temporary ID
 * - Update cache with queryClient.setQueryData
 * - Handle rollback in onError
 * - Invalidate queries in onSettled
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: taskApi.createTask,
    // TODO: Add optimistic updates here
    onSuccess: () => {
      // Basic implementation - just refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.tasksList() })
    },
  })
}

/**
 * Hook to update a task with optimistic updates
 * 
 * TODO: Implement optimistic updates for task updates
 * HINTS:
 * - Use onMutate to update task in cache immediately
 * - Cancel outgoing queries and snapshot previous data
 * - Update specific task in cache using map
 * - Handle rollback in onError
 * - Invalidate queries in onSettled
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskInput }) =>
      taskApi.updateTask(id, updates),
    // TODO: Add optimistic updates here
    onSuccess: () => {
      // Basic implementation - just refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.tasksList() })
    },
  })
}

/**
 * Hook to delete a task with optimistic updates
 * 
 * TODO: Implement optimistic updates for task deletion
 * HINTS:
 * - Use onMutate to remove task from cache immediately
 * - Cancel outgoing queries and snapshot previous data
 * - Filter out deleted task from cache
 * - Handle rollback in onError
 * - Invalidate queries in onSettled
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: taskApi.deleteTask,
    // TODO: Add optimistic updates here
    onSuccess: () => {
      // Basic implementation - just refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.tasksList() })
    },
  })
}

/**
 * Hook to fetch task statistics (bonus feature)
 */
export const useTaskStats = () => {
  return useQuery({
    queryKey: queryKeys.tasksStats(),
    queryFn: taskApi.getTaskStats,
    staleTime: 60 * 1000, // 1 minute
  })
}

