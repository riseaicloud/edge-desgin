import type { Meta, StoryObj } from '@storybook/react'
import { Server } from 'lucide-react'
import { KPICard } from './kpi-card'

const meta: Meta<typeof KPICard> = {
  title: '二次封装/KPICard',
  parameters: { componentSubtitle: '自研 · 原生' },
  component: KPICard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof KPICard>

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <KPICard icon={Server} title="节点总数" value={12} unit="个" />
    </div>
  ),
}
