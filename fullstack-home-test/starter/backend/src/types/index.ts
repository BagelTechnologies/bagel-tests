import { z } from 'zod';

// Zod schemas for validation
export const TaskStatus = z.enum(['open', 'done']);

export const CreateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
});

export const UpdateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters')
    .trim()
    .optional(),
  status: TaskStatus.optional(),
});

export const TaskParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format'),
});

// TypeScript types
export type TaskStatusType = z.infer<typeof TaskStatus>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskParams = z.infer<typeof TaskParamsSchema>;

// Database types
export interface ITask {
  _id: string;
  title: string;
  status: TaskStatusType;
  createdAt: Date;
  updatedAt: Date;
}

// Response types
export interface TaskResponse {
  id: string;
  title: string;
  status: TaskStatusType;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface TaskStats {
  status: string;
  count: number;
}

