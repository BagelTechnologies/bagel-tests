import React from 'react'
import { Container, Title, Text, Space } from '@mantine/core'
import { TaskManager } from './components/TaskManager'

function App() {
  return (
    <Container size="md" py="xl">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title order={1} c="blue">
          📋 Task Manager
        </Title>
        <Text c="dimmed" size="lg">
          Full-Stack Home Test - React + React Query + TypeScript + Mantine
        </Text>
      </div>
      
      <Space h="xl" />
      
      <TaskManager />
    </Container>
  )
}

export default App