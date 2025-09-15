import { Router, Request, Response, NextFunction } from 'express';
import { TaskServices } from './services.js';
import { 
  CreateTaskSchema, 
  UpdateTaskSchema, 
  TaskParamsSchema,
  ApiResponse 
} from '../types/index.js';
import { ZodError } from 'zod';

const router = Router();
const taskServices = new TaskServices();

/**
 * GET /api/tasks/stats
 * Get task statistics
 */
router.get('/stats', async (
  _req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await taskServices.getTaskStats();
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tasks
 * Get all tasks
 */
router.get('/', async (
  _req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const tasks = await taskServices.getAllTasks();
    
    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tasks
 * Create a new task
 * 
 * TODO: Implement task creation
 * HINTS:
 * - Validate request body using CreateTaskSchema.parse(req.body)
 * - Call taskServices.createTask(validatedData) 
 * - Return 201 status with created task
 * - Handle ZodError for validation failures (400 status)
 * - Handle other errors with next(error)
 */
router.post('/', async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement task creation logic here
    res.status(501).json({
      success: false,
      error: 'Not implemented yet - you need to implement task creation!',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tasks/:id
 * Get a specific task
 * 
 * TODO: Implement get task by ID
 * HINTS:
 * - Validate params using TaskParamsSchema.parse(req.params)
 * - Call taskServices.getTaskById(id)
 * - Return task data or 404 if not found
 * - Handle validation errors (400 status)
 */
router.get('/:id', async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement get task by ID logic here
    res.status(501).json({
      success: false,
      error: 'Not implemented yet - you need to implement get task by ID!',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/tasks/:id
 * Update a task
 * 
 * TODO: Implement task update
 * HINTS:
 * - Validate params using TaskParamsSchema.parse(req.params)
 * - Validate body using UpdateTaskSchema.parse(req.body)
 * - Call taskServices.updateTask(id, validatedData)
 * - Return updated task or 404 if not found
 * - Handle ZodError for validation failures (400 status)
 */
router.patch('/:id', async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement task update logic here
    res.status(501).json({
      success: false,
      error: 'Not implemented yet - you need to implement task updates!',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 * 
 * TODO: Implement task deletion
 * HINTS:
 * - Validate params using TaskParamsSchema.parse(req.params)
 * - Call taskServices.deleteTask(id)
 * - Return 204 status (no content) on success
 * - Return 404 if task not found
 * - Handle validation errors (400 status)
 */
router.delete('/:id', async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement task deletion logic here
    res.status(501).json({
      success: false,
      error: 'Not implemented yet - you need to implement task deletion!',
    });
  } catch (error) {
    next(error);
  }
});

export { router as taskRoutes };

