import React, { Component, ReactNode } from 'react'
import { Alert, Button, Stack, Text, Code } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error boundary component to catch and display React errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          icon={<IconAlertTriangle size={16} />}
          color="red"
          title="Something went wrong"
        >
          <Stack gap="md">
            <Text>
              An unexpected error occurred in the application. Please try again.
            </Text>
            
            <details>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                <Text size="sm" c="dimmed">Error details (click to expand)</Text>
              </summary>
              <Code block>
                {this.state.error?.toString()}
                {'\n\n'}
                {this.state.error?.stack}
              </Code>
            </details>
            
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Try again
            </Button>
          </Stack>
        </Alert>
      )
    }

    return this.props.children
  }
}