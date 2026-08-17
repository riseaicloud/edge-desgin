import type { Meta, StoryObj } from '@storybook/react'
import { StatusIndicator } from './status-indicator'

const meta: Meta<typeof StatusIndicator> = {
  title: '二次封装/StatusIndicator',
  parameters: { componentSubtitle: '自研（状态色故意固定色相：绿=健康不随主题反转） · 原生' },
  component: StatusIndicator,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatusIndicator>

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <StatusIndicator variant="success" label="运行中" />
      <StatusIndicator variant="warning" label="降级" />
      <StatusIndicator variant="error" label="故障" animated />
      <StatusIndicator variant="info" label="部署中" />
      <StatusIndicator variant="neutral" label="未知" />
    </div>
  ),
}
