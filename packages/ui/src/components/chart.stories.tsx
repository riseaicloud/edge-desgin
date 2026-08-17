import type { Meta, StoryObj } from '@storybook/react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart'

const meta: Meta<typeof ChartContainer> = {
  title: 'Shadcn 原生/Chart',
  parameters: { componentSubtitle: 'shadcn 适配（裁剪版） · recharts' },
  component: ChartContainer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ChartContainer>

const data = [
  { day: '周一', value: 42 },
  { day: '周二', value: 61 },
  { day: '周三', value: 35 },
  { day: '周四', value: 78 },
  { day: '周五', value: 55 },
]

export const Default: Story = {
  render: () => (
    <ChartContainer
      config={{ value: { label: 'GPU 利用率', color: 'hsl(var(--primary))' } }}
      className="h-48 w-96"
    >
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
}
