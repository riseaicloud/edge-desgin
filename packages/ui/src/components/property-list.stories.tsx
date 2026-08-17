import type { Meta, StoryObj } from '@storybook/react'
import { PropertyList } from './property-list'

const meta: Meta<typeof PropertyList> = {
  title: '二次封装/PropertyList',
  parameters: { componentSubtitle: '自研 · 原生' },
  component: PropertyList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PropertyList>

export const Default: Story = {
  render: () => (
    <div className="w-[560px]">
      <PropertyList
        columns={3}
        items={[
          { label: '名称', value: 'prod-cluster' },
          { label: '状态', value: '运行中' },
          { label: '版本', value: 'v1.28.4' },
          { label: '节点数', value: 12 },
          { label: '创建时间', value: '2026-08-01 10:24' },
          { label: '描述', value: '生产集群', span: 2 },
        ]}
      />
    </div>
  ),
}
