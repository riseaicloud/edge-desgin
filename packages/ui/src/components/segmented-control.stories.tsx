import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SegmentedControl } from './segmented-control'

const meta: Meta<typeof SegmentedControl> = {
  title: '二次封装/SegmentedControl',
  parameters: { componentSubtitle: '自研（shadcn 无此组件） · Radix RadioGroup 底座' },
  component: SegmentedControl,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SegmentedControl>

const computeTypes = [
  { value: 'private_gpu', label: '算力独享' },
  { value: 'oversub_gpu', label: '算力超分' },
  { value: 'shared_gpu', label: '算力共享' },
  { value: 'cpu', label: '仅 CPU' },
]

/** 灰底容器 + 实心胶囊（CAMP 创建实例「架构/类型」同款；含键盘导航断言） */
export const Pill: Story = {
  render: function PillStory() {
    const [v, setV] = React.useState('oversub_gpu')
    return <SegmentedControl variant="pill" options={computeTypes} value={v} onValueChange={setV} />
  },
  play: async ({ canvasElement }) => {
    const { expect, userEvent, within, waitFor } = await import('@storybook/test')
    const canvas = within(canvasElement)
    // radio 语义：点选 + 方向键在选项间移动（Radix RadioGroup 底座）
    const first = canvas.getByRole('radio', { name: '算力独享' })
    await userEvent.click(first)
    // 受控组件：等 onValueChange → setState → 重渲染落定
    await waitFor(() => expect(first).toHaveAttribute('data-state', 'checked'))
    // 键盘步前显式聚焦；按键用「按下→断言→抬起」——Radix 的 arrow-select 依赖
    // document keyup 前的旗标，0ms 的合成 down+up 会踩竞态（真人按键无此问题，
    // 实测 80ms 间隔即正常，纯测试层适配）
    first.focus()
    await userEvent.keyboard('{ArrowRight>}')
    await waitFor(() =>
      expect(canvas.getByRole('radio', { name: '算力超分' })).toHaveAttribute('data-state', 'checked')
    )
    await userEvent.keyboard('{/ArrowRight}')
  },
}

/** 连体按钮组，选中主题色实心（el-radio-button 经典款） */
export const Solid: Story = {
  render: function SolidStory() {
    const [v, setV] = React.useState('private_gpu')
    return <SegmentedControl variant="solid" options={computeTypes} value={v} onValueChange={setV} />
  },
}

/** 连体按钮组，选中主题色描边 */
export const Outline: Story = {
  render: function OutlineStory() {
    const [v, setV] = React.useState('private_gpu')
    return <SegmentedControl variant="outline" options={computeTypes} value={v} onValueChange={setV} />
  },
}

/** 独立 chips，选中描边+淡底，超宽自动换行 */
export const Chips: Story = {
  render: function ChipsStory() {
    const [v, setV] = React.useState('oversub_gpu')
    return <SegmentedControl variant="chips" options={computeTypes} value={v} onValueChange={setV} />
  },
}

/** 单项禁用 */
export const DisabledOption: Story = {
  render: function DisabledStory() {
    const [v, setV] = React.useState('private_gpu')
    return (
      <SegmentedControl
        variant="pill"
        options={computeTypes.map((o) => (o.value === 'shared_gpu' ? { ...o, disabled: true } : o))}
        value={v}
        onValueChange={setV}
      />
    )
  },
}

/** 表单集成：name 提交 + 联动条件渲染（值是一等表单参数，下方内容随值切换） */
export const InForm: Story = {
  render: function InFormStory() {
    const [type, setType] = React.useState('oversub_gpu')
    return (
      <form className="w-[480px] space-y-3">
        <SegmentedControl
          variant="solid"
          name="computeType"
          options={computeTypes}
          value={type}
          onValueChange={setType}
        />
        <p className="text-sm text-muted-foreground">
          {type === 'cpu' ? '↓ 仅 CPU：隐藏 GPU 规格选择' : '↓ 这里渲染 GPU 规格 / 显卡厂商选择器'}
        </p>
      </form>
    )
  },
}
