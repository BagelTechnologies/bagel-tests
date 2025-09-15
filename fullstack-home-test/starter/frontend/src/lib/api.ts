import axios from 'axios'
import type { Task, CreateTaskInput, UpdateTaskInput, ApiResponse, TaskStats } from '../types/task'

//@ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Task API functions
export const taskApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks')
    return response.data.data || []
  },

  // Create a new task
  // TODO: Implement task creation API call
  // HINTS:
  // - Make POST request to '/tasks' with input data
  createTask: async (input: CreateTaskInput): Promise<Task> => {
    // TODO: Implement this API call
    throw new Error('createTask not implemented yet - you need to implement this!')
  },

  // Update a task
  // TODO: Implement task update API call
  // HINTS:
  // - Make PATCH request to `/tasks/${id}` with input data
  updateTask: async (id: string, input: UpdateTaskInput): Promise<Task> => {
    // TODO: Implement this API call
    throw new Error('updateTask not implemented yet - you need to implement this!')
  },

  // Delete a task
  // TODO: Implement task deletion API call
  // HINTS:
  // - Make DELETE request to `/tasks/${id}`
  deleteTask: async (id: string): Promise<void> => {
    // TODO: Implement this API call
    throw new Error('deleteTask not implemented yet - you need to implement this!')
  },

  // Get task by ID (bonus)
  // TODO: Implement get task by ID API call (bonus feature)
  // HINTS:
  // - Make GET request to `/tasks/${id}`
  getTaskById: async (id: string): Promise<Task> => {
    // TODO: Implement this API call
    throw new Error('getTaskById not implemented yet - you need to implement this!')
  },

  // Get task statistics (bonus)
  getTaskStats: async (): Promise<TaskStats[]> => {
    const response = await api.get<ApiResponse<TaskStats[]>>('/tasks/stats')
    return response.data.data || []
  },
}

