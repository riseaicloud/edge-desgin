import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './separator'

const meta: Meta<typeof Separator> = {
  title: 'Shadcn 原生/Separator',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix Separator' },
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <div className="text-sm">Content above separator</div>
      <Separator />
      <div className="text-sm">Content below separator</div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-24">
      <div className="text-sm">Left</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Right</div>
    </div>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="w-full max-w-md rounded-lg border p-4">
      <div className="text-sm font-medium">Account Settings</div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <div className="text-sm">Profile Information</div>
        <div className="text-sm text-muted-foreground">Update your personal details</div>
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <div className="text-sm">Security</div>
        <div className="text-sm text-muted-foreground">Manage your password</div>
      </div>
    </div>
  ),
}
