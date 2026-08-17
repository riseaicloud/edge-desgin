import type { Meta, StoryObj } from '@storybook/react'
import { Alert, AlertTitle, AlertDescription } from './alert'
import { AlertCircle } from 'lucide-react'

const meta: Meta<typeof Alert> = {
  title: 'Shadcn 原生/Alert',
  parameters: { componentSubtitle: 'shadcn 原版 · 原生' },
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is an informational alert message.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try again later.
      </AlertDescription>
    </Alert>
  ),
}

export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Update Available</AlertTitle>
      <AlertDescription>
        A new version of the application is available.
      </AlertDescription>
    </Alert>
  ),
}

export const Simple: Story = {
  render: () => (
    <Alert>
      <AlertDescription>
        Your session will expire in 5 minutes. Please save your work.
      </AlertDescription>
    </Alert>
  ),
}
