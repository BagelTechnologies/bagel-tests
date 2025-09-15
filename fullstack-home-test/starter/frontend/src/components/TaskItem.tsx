import React, { useState } from 'react'
import { 
  Group, 
  Text, 
  ActionIcon, 
  Checkbox, 
  TextInput, 
  Button,
  Paper,
  Stack,
  Modal,
  Alert
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { 
  IconEdit, 
  IconTrash, 
  IconCheck, 
  IconX,
  IconAlertCircle 
} from '@tabler/icons-react'
import { useUpdateTask, useDeleteTask } from '../hooks/useTasks'
import type { Task } from '../types/task'

interface TaskItemProps {
  task: Task
}

/**
 * Individual task item component with edit, toggle, and delete functionality
 */
export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const handleToggleStatus = async () => {
    // TODO: This will work once you implement updateTask in api.ts and useTasks.ts
    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        updates: { status: task.status === 'open' ? 'done' : 'open' }
      })
      notifications.show({
        title: 'Success',
        message: `Task marked as ${task.status === 'open' ? 'done' : 'open'}`,
        color: 'green',
      })
    } catch (error: any) {
      notifications.show({
        title: 'Not Implemented Yet',
        message: 'You need to implement updateTask in api.ts and add optimistic updates!',
        color: 'orange',
      })
    }
  }

  const handleSaveEdit = async () => {
    const trimmedTitle = editTitle.trim()
    if (!trimmedTitle) {
      notifications.show({
        title: 'Error',
        message: 'Title cannot be empty',
        color: 'red',
      })
      return
    }

    if (trimmedTitle === task.title) {
      setIsEditing(false)
      return
    }

    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        updates: { title: trimmedTitle }
      })
      setIsEditing(false)
      notifications.show({
        title: 'Success',
        message: 'Task updated successfully',
        color: 'green',
      })
    } catch (error: any) {
      notifications.show({
        title: 'Not Implemented Yet',
        message: 'You need to implement updateTask in api.ts and add optimistic updates!',
        color: 'orange',
      })
      setEditTitle(task.title) // Reset on error
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditTitle(task.title)
  }

  const handleDelete = async () => {
    // TODO: This will work once you implement deleteTask in api.ts and useTasks.ts
    try {
      await deleteTaskMutation.mutateAsync(task.id)
      closeDelete()
      notifications.show({
        title: 'Success',
        message: 'Task deleted successfully',
        color: 'green',
      })
    } catch (error: any) {
      closeDelete()
      notifications.show({
        title: 'Not Implemented Yet',
        message: 'You need to implement deleteTask in api.ts and add optimistic updates!',
        color: 'orange',
      })
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSaveEdit()
    } else if (event.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <>
      <Paper p="md" withBorder shadow="xs" bg={task.status === 'done' ? 'gray.0' : undefined}>
        <Group justify="space-between" align="flex-start">
          {/* Left side - Checkbox and content */}
          <Group align="flex-start" gap="md" style={{ flex: 1 }}>
            <Checkbox
              checked={task.status === 'done'}
              onChange={handleToggleStatus}
              disabled={updateTaskMutation.isPending}
              size="md"
              mt={2}
            />
            
            <Stack gap="xs" style={{ flex: 1 }}>
              {isEditing ? (
                <Group gap="xs">
                  <TextInput
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    maxLength={200}
                    style={{ flex: 1 }}
                    autoFocus
                  />
                  <Button
                    size="xs"
                    variant="filled"
                    color="green"
                    onClick={handleSaveEdit}
                    loading={updateTaskMutation.isPending}
                    leftSection={<IconCheck size={14} />}
                  >
                    Save
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    color="gray"
                    onClick={handleCancelEdit}
                    leftSection={<IconX size={14} />}
                  >
                    Cancel
                  </Button>
                </Group>
              ) : (
                <Text
                  size="md"
                  td={task.status === 'done' ? 'line-through' : undefined}
                  c={task.status === 'done' ? 'dimmed' : undefined}
                  style={{ cursor: 'pointer' }}
                  onDoubleClick={() => setIsEditing(true)}
                  title="Double-click to edit"
                >
                  {task.title}
                </Text>
              )}
              
              <Text size="xs" c="dimmed">
                Created: {new Date(task.createdAt).toLocaleDateString()}
                {task.updatedAt !== task.createdAt && (
                  <> • Updated: {new Date(task.updatedAt).toLocaleDateString()}</>
                )}
              </Text>
            </Stack>
          </Group>

          {/* Right side - Action buttons */}
          {!isEditing && (
            <Group gap="xs">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => setIsEditing(true)}
                title="Edit task"
              >
                <IconEdit size={16} />
              </ActionIcon>
              
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={openDelete}
                title="Delete task"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          )}
        </Group>

        {/* Error messages */}
        {updateTaskMutation.error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            mt="xs"
          >
            Failed to update: {updateTaskMutation.error.message}
          </Alert>
        )}
      </Paper>

      {/* Delete confirmation modal */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Delete Task"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete this task? This action cannot be undone.
          </Text>
          <Text fw={500} c="dark">
            "{task.title}"
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={closeDelete}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDelete}
              loading={deleteTaskMutation.isPending}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}