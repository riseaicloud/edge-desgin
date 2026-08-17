import type { Meta, StoryObj } from '@storybook/react'
import { ResourceChart } from './resource-chart'

const meta: Meta<typeof ResourceChart> = {
  title: '二次封装/ResourceChart',
  parameters: { componentSubtitle: '自研 · recharts' },
  component: ResourceChart,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ResourceChart>

const series = Array.from({ length: 12 }, (_, i) => ({
  time: `10:${String(i * 5).padStart(2, '0')}`,
  value: 40 + Math.round(30 * Math.abs(Math.sin(i / 2))),
}))

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <ResourceChart
        title="CPU 使用率"
        currentValue="2.4 核"
        percentage={60}
        unit="%"
        timeSeries={series}
      />
    </div>
  ),
}
