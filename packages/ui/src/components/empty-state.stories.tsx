import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './empty-state'
import { FolderOpen, Users, Search, Database } from 'lucide-react'

const meta: Meta<typeof EmptyState> = {
  title: '二次封装/EmptyState',
  parameters: { componentSubtitle: '自研 · 原生' },
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {},
}

export const CustomTitle: Story = {
  args: {
    title: "没有找到任何结果",
  },
}

export const WithFolderIcon: Story = {
  args: {
    title: "暂无项目",
    icon: FolderOpen,
  },
}

export const WithUsersIcon: Story = {
  args: {
    title: "还没有成员",
    icon: Users,
  },
}

export const WithSearchIcon: Story = {
  args: {
    title: "未找到匹配的内容",
    icon: Search,
  },
}

export const WithDatabaseIcon: Story = {
  args: {
    title: "数据库为空",
    icon: Database,
  },
}

export const InCard: Story = {
  render: () => (
    <div className="w-full max-w-md border rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700">资源列表</h3>
      </div>
      <EmptyState title="暂无资源" icon={Database} />
    </div>
  ),
}

export const LoadingState: Story = {
  args: {
    title: "暂无数据",
    loading: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
      <div className="border rounded-lg">
        <EmptyState title="暂无项目" icon={FolderOpen} />
      </div>
      <div className="border rounded-lg">
        <EmptyState title="还没有成员" icon={Users} />
      </div>
      <div className="border rounded-lg">
        <EmptyState title="未找到匹配的内容" icon={Search} />
      </div>
      <div className="border rounded-lg">
        <EmptyState title="数据库为空" icon={Database} />
      </div>
    </div>
  ),
}
