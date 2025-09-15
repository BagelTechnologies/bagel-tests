import mongoose from 'mongoose';
import { TaskServices } from '../tasks/services.js';

/**
 * Health check services
 */
export class HealthServices {
  private taskServices: TaskServices;

  constructor() {
    this.taskServices = new TaskServices();
  }

  /**
   * Check overall system health
   */
  async checkHealth(): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    services: {
      database: 'connected' | 'disconnected';
      api: 'operational';
    };
    info?: {
      uptime: number;
      memory: NodeJS.MemoryUsage;
      tasksCount: number;
    };
  }> {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const memory = process.memoryUsage();

    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Get basic stats
    let tasksCount = 0;
    try {
      const hasAnyTasks = await this.taskServices.hasAnyTasks();
      tasksCount = hasAnyTasks ? 1 : 0; // Simplified for health check
    } catch (error) {
      console.error('Health check - failed to get tasks count:', error);
    }

    const isHealthy = dbStatus === 'connected';

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp,
      services: {
        database: dbStatus,
        api: 'operational',
      },
      info: {
        uptime,
        memory,
        tasksCount,
      },
    };
  }

  /**
   * Simple health check
   */
  async isHealthy(): Promise<boolean> {
    try {
      const health = await this.checkHealth();
      return health.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}

