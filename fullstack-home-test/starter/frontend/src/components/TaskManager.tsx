import React from 'react'
import { Stack } from '@mantine/core'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { TaskStats } from './TaskStats'
import { ErrorBoundary } from './ErrorBoundary'

/**
 * Main task management component
 * Orchestrates the task form, list, and stats components
 */
export const TaskManager: React.FC = () => {
  return (
    <ErrorBoundary>
      <Stack gap="xl">
        {/* Task Statistics */}
        <TaskStats />
        
        {/* Task Creation Form */}
        <TaskForm />
        
        {/* Task List */}
        <TaskList />
      </Stack>
    </ErrorBoundary>
  )
}