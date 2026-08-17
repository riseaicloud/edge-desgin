import type { Meta, StoryObj } from '@storybook/react'
import { PropertyHoverCard } from './property-hover-card'

const meta: Meta<typeof PropertyHoverCard> = {
  title: '二次封装/PropertyHoverCard',
  parameters: { componentSubtitle: '组合封装 · HoverCard + PropertyItem' },
  component: PropertyHoverCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PropertyHoverCard>

/** 设备详情悬浮卡（CAMP 实例列表显卡型号同款交互） */
export const Default: Story = {
  render: () => (
    <div className="p-16 text-sm">
      <PropertyHoverCard
        items={[
          { label: '厂商', value: 'Ascend' },
          { label: '型号', value: 'Ascend910B4-32G' },
          { label: '显卡数', value: 1 },
          { label: '算力', value: '280TFLOPS' },
          { label: '显存', value: '32GiB' },
          { label: '设备名称', value: 'node-001-ascend-4' },
          { label: '设备 ID', value: '39A12A64-010074F2-6632A633-87D28485-104301E3' },
        ]}
      >
        Ascend910B4-32G
      </PropertyHoverCard>
    </div>
  ),
}

/** 无下划线触发样式 + 自定义值渲染（状态点 / 徽标等 ReactNode） */
export const CustomTrigger: Story = {
  render: () => (
    <div className="p-16 text-sm">
      <PropertyHoverCard
        underline={false}
        side="right"
        items={[
          { label: '状态', value: <span className="text-green-600">运行中</span> },
          { label: '命名空间', value: 'gen-studio' },
          { label: '镜像', value: 'swr.cn-east-3.myhuaweicloud.com/risecloud/vllm:v0.8' },
        ]}
      >
        <span className="cursor-pointer text-primary">vllm-server-0</span>
      </PropertyHoverCard>
    </div>
  ),
}
