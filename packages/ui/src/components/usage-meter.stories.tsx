import type { Meta, StoryObj } from '@storybook/react'
import { UsageMeter } from './usage-meter'

const meta: Meta<typeof UsageMeter> = {
  title: '二次封装/UsageMeter',
  parameters: { componentSubtitle: '组合封装 · Progress + Tooltip' },
  component: UsageMeter,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof UsageMeter>

/** 资源用量列表 + 悬停明细（CAMP 资源池同款，鼠标移到「算力」行看明细） */
export const Default: Story = {
  render: () => (
    <div className="w-56">
      <UsageMeter
        label="vGPU"
        percent={50}
        details={[
          { label: '总量', value: '32 卡' },
          { label: '已分配', value: '16 卡' },
          { label: '剩余', value: '16 卡' },
        ]}
      />
      <UsageMeter
        label="算力"
        percent={50}
        details={[
          { label: '总量', value: '2240 TFLOPS' },
          { label: '已分配', value: '1120 TFLOPS' },
          { label: '剩余', value: '1120 TFLOPS' },
        ]}
      />
      <UsageMeter
        label="显存"
        percent={50}
        details={[
          { label: '总量', value: '1024 GiB' },
          { label: '已分配', value: '512 GiB' },
          { label: '剩余', value: '512 GiB' },
        ]}
      />
    </div>
  ),
}

/** tone="auto"：按水位取语义色（<70 绿、70–90 黄、≥90 红） */
export const AutoTone: Story = {
  render: () => (
    <div className="w-56">
      <UsageMeter label="CPU" percent={45} tone="auto" />
      <UsageMeter label="内存" percent={78} tone="auto" />
      <UsageMeter label="显存" percent={96} tone="auto" />
    </div>
  ),
}

/** 固定档 tone（默认 primary 跟主题） */
export const Tones: Story = {
  render: () => (
    <div className="w-56">
      <UsageMeter label="primary" percent={60} />
      <UsageMeter label="success" percent={60} tone="success" />
      <UsageMeter label="warning" percent={60} tone="warning" />
      <UsageMeter label="danger" percent={60} tone="danger" />
    </div>
  ),
}

/** 运行时动态色：color 收任意 CSS 颜色（如接口下发的厂商色），覆盖 tone */
export const CustomColor: Story = {
  render: () => (
    <div className="w-56">
      <UsageMeter label="Ascend" percent={50} color="#c7000b" />
      <UsageMeter label="NVIDIA" percent={72} color="#76b900" />
      <UsageMeter label="渐变值" percent={60} color="hsl(280 70% 55%)" />
    </div>
  ),
}

/** 无百分比文字 + 自定义条宽 */
export const BarOnly: Story = {
  render: () => (
    <div className="w-64">
      <UsageMeter label="配额" percent={72} showPercent={false} barClassName="w-36" />
    </div>
  ),
}
