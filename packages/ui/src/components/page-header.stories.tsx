import type { Meta, StoryObj } from '@storybook/react'
import { PageHeader } from './page-header'
import { Button } from './button'
import { LayoutDashboard } from 'lucide-react'

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: { title: '概览' },
}

export const WithIcon: Story = {
  args: {
    title: '集群管理',
    icon: <LayoutDashboard className="h-5 w-5 text-gray-600" />,
  },
}

export const WithBackAndExtra: Story = {
  args: {
    title: '节点详情 · node-a1',
    icon: <LayoutDashboard className="h-5 w-5 text-gray-600" />,
    onBack: () => alert('back'),
    extra: <Button>编辑</Button>,
  },
}
