import { TaskData } from './data.js';
import { CreateTaskInput, UpdateTaskInput, TaskResponse } from '../types/index.js';

/**
 * Business logic layer for tasks
 * Handles validation, transformations, and business rules
 */
export class TaskServices {
  private taskData: TaskData;

  constructor() {
    this.taskData = new TaskData();
  }

  /**
   * Get all tasks
   */
  async getAllTasks(): Promise<TaskResponse[]> {
    const tasks = await this.taskData.findAll();
    return tasks.map(task => this.formatTaskResponse(task));
  }

  /**
   * Create a new task
   * 
   * TODO: Implement task creation logic
   * HINTS:
   * - Trim the title: data.title.trim()
   * - Validate title is not empty (throw Error if empty)
   * - Call this.taskData.create(trimmedData)
   * - Format response with this.formatTaskResponse(task)
   */
  async createTask(data: CreateTaskInput): Promise<TaskResponse> {
    // TODO: Implement task creation business logic here
    throw new Error('Not implemented yet - you need to implement task creation in services!');
  }

  /**
   * Get task by ID
   * 
   * TODO: Implement get task by ID logic
   * HINTS:
   * - Call this.taskData.findById(id)
   * - Check if task exists, throw Error('Task not found') if not
   * - Format response with this.formatTaskResponse(task)
   */
  async getTaskById(id: string): Promise<TaskResponse> {
    // TODO: Implement get task by ID business logic here
    throw new Error('Not implemented yet - you need to implement get task by ID in services!');
  }

  /**
   * Update a task
   * 
   * TODO: Implement task update logic
   * HINTS:
   * - Validate updates: if title provided, trim it and check not empty
   * - Call this.taskData.updateById(id, validatedUpdates)
   * - Check if task exists, throw Error('Task not found') if not
   * - Format response with this.formatTaskResponse(task)
   */
  async updateTask(id: string, updates: UpdateTaskInput): Promise<TaskResponse> {
    // TODO: Implement task update business logic here
    throw new Error('Not implemented yet - you need to implement task updates in services!');
  }

  /**
   * Delete a task
   * 
   * TODO: Implement task deletion logic
   * HINTS:
   * - Call this.taskData.deleteById(id)
   * - Check if task existed, throw Error('Task not found') if not
   */
  async deleteTask(id: string): Promise<void> {
    // TODO: Implement task deletion business logic here
    throw new Error('Not implemented yet - you need to implement task deletion in services!');
  }

  /**
   * Get task statistics
   */
  async getTaskStats(): Promise<{ status: string; count: number }[]> {
    return await this.taskData.getStats();
  }

  /**
   * Check if tasks exist (for health check)
   */
  async hasAnyTasks(): Promise<boolean> {
    const count = await this.taskData.count();
    return count > 0;
  }

  /**
   * Format task for API response
   */
  private formatTaskResponse(task: any): TaskResponse {
    return {
      id: task._id.toString(),
      title: task.title,
      status: task.status,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}

