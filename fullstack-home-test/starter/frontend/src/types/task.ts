export type TaskStatus = 'open' | 'done'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface CreateTaskInput {
  title: string
}

export interface UpdateTaskInput {
  title?: string
  status?: TaskStatus
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

export interface TaskStats {
  status: string
  count: number
}

