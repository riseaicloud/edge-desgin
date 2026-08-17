import type { Meta, StoryObj } from '@storybook/react'
import { Container } from 'lucide-react'
import { ResourceNameCell } from './resource-name-cell'

const meta: Meta<typeof ResourceNameCell> = {
  title: '二次封装/ResourceNameCell',
  parameters: { componentSubtitle: '组合封装 · CopyButton（含 HTTP 环境剪贴板兜底）' },
  component: ResourceNameCell,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ResourceNameCell>

/** 默认形态：点 ID 跳详情（CAMP 惯例）+ 复制（CAMP 实例列表首列同款） */
export const Default: Story = {
  render: () => (
    <div className="w-64">
      <ResourceNameCell
        icon={<Container className="h-6 w-6 text-sky-600" />}
        name="test"
        id="tk-0-217683d0-a3a4-4e5f-9702-2d28485104e3"
        onIdClick={() => alert('跳详情')}
      />
    </div>
  ),
}

/** 备用通道：名称可点跳详情 */
export const NameClickable: Story = {
  render: () => (
    <div className="w-64">
      <ResourceNameCell
        name="test"
        id="tk-0-217683d0-a3a4-4e5f-9702-2d28485104e3"
        onNameClick={() => alert('跳详情')}
      />
    </div>
  ),
}

/** 无图标、名称不可点（纯展示行） */
export const Plain: Story = {
  render: () => (
    <div className="w-56">
      <ResourceNameCell name="算力容器" id="tk-0-fd881a5a-85f0-4e5f-9702-2d28485104e3" />
    </div>
  ),
}

/** 仅名称（无 ID 行） */
export const NameOnly: Story = {
  render: () => (
    <div className="w-56">
      <ResourceNameCell name="prod-cluster" onNameClick={() => alert('跳详情')} />
    </div>
  ),
}
