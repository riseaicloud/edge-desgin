import type { Meta, StoryObj } from '@storybook/react'
import { ProgressRing } from './progress-ring'

const meta: Meta<typeof ProgressRing> = {
  title: '二次封装/ProgressRing',
  parameters: { componentSubtitle: '自研 · SVG' },
  component: ProgressRing,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProgressRing>

export const Default: Story = {
  render: () => (
    <div className="flex gap-6">
      <ProgressRing value={35}>
        <span className="text-xs">35%</span>
      </ProgressRing>
      <ProgressRing value={72}>
        <span className="text-xs">72%</span>
      </ProgressRing>
    </div>
  ),
}
