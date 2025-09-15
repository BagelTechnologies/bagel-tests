import React from 'react'
import { Stack, Title, Text, Loader, Alert, Center } from '@mantine/core'
import { IconAlertCircle, IconChecklist } from '@tabler/icons-react'
import { useTasks } from '../hooks/useTasks'
import { TaskItem } from './TaskItem'
import type { Task } from '../types/task'

/**
 * Component that displays the list of tasks
 */
export const TaskList: React.FC = () => {
  const { data: tasks, isLoading, error, isError } = useTasks()

  if (isLoading) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading tasks...</Text>
        </Stack>
      </Center>
    )
  }

  if (isError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        color="red"
        title="Failed to load tasks"
      >
        {error?.message || 'An unexpected error occurred'}
      </Alert>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <IconChecklist size={48} stroke={1.5} />
          <Stack align="center" gap="xs">
            <Title order={3} c="dimmed">No tasks yet</Title>
            <Text c="dimmed" size="sm" ta="center">
              Create your first task using the form above!
            </Text>
          </Stack>
        </Stack>
      </Center>
    )
  }

  return (
    <Stack gap="md">
      <Title order={2} size="h3">
        Tasks ({tasks.length})
      </Title>
      <Stack gap="xs">
        {tasks.map((task: Task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </Stack>
    </Stack>
  )
}