/**
 * Query key factory for consistent query key management
 * This ensures proper cache invalidation and avoids key collisions
 */
export const queryKeys = {
  // Base keys
  tasks: ['tasks'] as const,
  taskStats: ['taskStats'] as const,

  // Derived keys
  tasksList: () => [...queryKeys.tasks, 'list'] as const,
  tasksDetail: (id: string) => [...queryKeys.tasks, 'detail', id] as const,
  tasksStats: () => [...queryKeys.taskStats] as const,

  // Filter-based keys (for future filtering features)
  tasksFiltered: (filters: Record<string, any>) => 
    [...queryKeys.tasks, 'filtered', filters] as const,
} as const

// Type helpers for better TypeScript support
export type QueryKeys = typeof queryKeys

