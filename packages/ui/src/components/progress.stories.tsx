import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './progress'

const meta: Meta<typeof Progress> = {
  title: 'Shadcn 原生/Progress',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix Progress' },
  component: Progress,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  render: () => (
    <div className="w-72 space-y-3">
      <Progress value={30} />
      <Progress value={65} />
      <Progress value={100} />
    </div>
  ),
}
