import React from 'react'
import { Paper, Group, Stack, Text, Progress, SimpleGrid } from '@mantine/core'
import { IconChartBar } from '@tabler/icons-react'
import { useTaskStats } from '../hooks/useTasks'

/**
 * Component displaying task statistics (bonus feature)
 */
export const TaskStats: React.FC = () => {
  const { data: stats, isLoading, error } = useTaskStats()

  if (isLoading || error || !stats) return null // Fail silently for bonus feature

  const openCount = stats.find(s => s.status === 'open')?.count || 0
  const doneCount = stats.find(s => s.status === 'done')?.count || 0
  const totalCount = openCount + doneCount

  if (totalCount === 0) return null

  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  return (
    <Paper p="md" withBorder shadow="sm">
      <Stack gap="md">
        <Group gap="xs">
          <IconChartBar size={20} />
          <Text fw={600} size="lg">Task Statistics</Text>
        </Group>
        
        <SimpleGrid cols={4} spacing="md">
          <Stack gap="xs" align="center">
            <Text size="xl" fw={700} c="blue">
              {totalCount}
            </Text>
            <Text size="sm" c="dimmed">
              Total
            </Text>
          </Stack>
          
          <Stack gap="xs" align="center">
            <Text size="xl" fw={700} c="orange">
              {openCount}
            </Text>
            <Text size="sm" c="dimmed">
              Open
            </Text>
          </Stack>
          
          <Stack gap="xs" align="center">
            <Text size="xl" fw={700} c="green">
              {doneCount}
            </Text>
            <Text size="sm" c="dimmed">
              Done
            </Text>
          </Stack>
          
          <Stack gap="xs" align="center">
            <Text size="xl" fw={700} c="teal">
              {completionRate}%
            </Text>
            <Text size="sm" c="dimmed">
              Complete
            </Text>
          </Stack>
        </SimpleGrid>
        
        {/* Progress bar */}
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Progress</Text>
            <Text size="sm" c="dimmed">{completionRate}% complete</Text>
          </Group>
          <Progress
            value={completionRate}
            size="lg"
            radius="xl"
            color="teal"
            striped
            animated={completionRate > 0 && completionRate < 100}
          />
        </Stack>
      </Stack>
    </Paper>
  )
}