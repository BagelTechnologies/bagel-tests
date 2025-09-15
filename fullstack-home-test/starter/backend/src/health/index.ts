import { Router, Request, Response, NextFunction } from 'express';
import { HealthServices } from './services.js';
import { ApiResponse } from '../types/index.js';

const router = Router();
const healthServices = new HealthServices();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', async (
  _req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const health = await healthServices.checkHealth();
    
    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json({
      success: health.status === 'healthy',
      data: health,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/health/simple
 * Simple health check (just returns OK if API is running)
 */
router.get('/simple', (_req: Request, res: Response<ApiResponse>): void => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      message: 'API is running',
      timestamp: new Date().toISOString(),
    },
  });
});

export { router as healthRoutes };

