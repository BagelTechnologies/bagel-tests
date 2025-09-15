import { Types } from 'mongoose';
import { Task } from '../database/index.js';
import { CreateTaskInput, UpdateTaskInput, ITask } from '../types/index.js';

/**
 * Data access layer for tasks
 * Handles all database operations
 */
export class TaskData {
  /**
   * Get all tasks sorted by creation date (newest first)
   */
  async findAll(): Promise<ITask[]> {
    return await Task.find({}).sort({ createdAt: -1 });
  }

  /**
   * Create a new task
   */
  async create(data: CreateTaskInput): Promise<ITask> {
    const task = new Task(data);
    return await task.save();
  }

  /**
   * Find task by ID
   */
  async findById(id: string): Promise<ITask | null> {
    this.validateObjectId(id);
    return await Task.findById(id);
  }

  /**
   * Update task by ID
   */
  async updateById(id: string, updates: UpdateTaskInput): Promise<ITask | null> {
    this.validateObjectId(id);
    return await Task.findByIdAndUpdate(
      id,
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    );
  }

  /**
   * Delete task by ID
   */
  async deleteById(id: string): Promise<ITask | null> {
    this.validateObjectId(id);
    return await Task.findByIdAndDelete(id);
  }

  /**
   * Get task statistics
   */
  async getStats(): Promise<{ status: string; count: number }[]> {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    return stats;
  }

  /**
   * Get total count of tasks
   */
  async count(): Promise<number> {
    return await Task.countDocuments();
  }

  /**
   * Validate MongoDB ObjectId
   */
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid task ID format');
    }
  }
}

