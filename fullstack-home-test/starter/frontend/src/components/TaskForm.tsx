import React from 'react'
import { Group, TextInput, Button, Alert } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPlus, IconAlertCircle } from '@tabler/icons-react'
import { useCreateTask } from '../hooks/useTasks'

/**
 * Form component for creating new tasks
 */
export const TaskForm: React.FC = () => {
  const createTaskMutation = useCreateTask()
  
  const form = useForm({
    initialValues: {
      title: '',
    },
    validate: {
      // TODO: Add proper form validation
      // HINTS:
      // - Check if title is empty after trimming
      // - Check if title exceeds 200 characters
      // - Return error message string or null if valid
      title: (value) => null, // Replace with your validation logic
    },
  })

  const handleSubmit = async (values: { title: string }) => {
    // TODO: Implement form submission with proper error handling
    // HINTS:
    // - Trim the title value
    // - Call createTaskMutation.mutateAsync with trimmed title
    // - Reset form on success
    // - Show success/error notifications
    // - Handle loading states
    
    notifications.show({
      title: 'Not Implemented Yet',
      message: 'You need to implement form submission! Check the TODO hints above.',
      color: 'orange',
      icon: <IconAlertCircle size={16} />,
    })
    
    console.log('Form submitted with:', values)
    // Replace this with your implementation
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group gap="md">
        <TextInput
          placeholder="Add a new task..."
          {...form.getInputProps('title')}
          flex={1}
          disabled={createTaskMutation.isPending}
          maxLength={200}
        />
        <Button
          type="submit"
          loading={createTaskMutation.isPending}
          leftSection={<IconPlus size={16} />}
          disabled={!form.values.title.trim()}
        >
          Add Task
        </Button>
      </Group>
      
      {/* Error message */}
      {createTaskMutation.error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          mt="md"
          title="Failed to create task"
        >
          {createTaskMutation.error.message}
        </Alert>
      )}
    </form>
  )
}