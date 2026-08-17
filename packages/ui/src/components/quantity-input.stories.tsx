import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QuantityInput } from './quantity-input'
import { Label } from './label'

const meta: Meta<typeof QuantityInput> = {
  title: '二次封装/QuantityInput',
  parameters: { componentSubtitle: '组合封装 · SelectRoot + 自研步进' },
  component: QuantityInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof QuantityInput>

/** 内存资源量（数值 + 单位下拉） */
export const Memory: Story = {
  render: function MemoryStory() {
    const [v, setV] = React.useState(6)
    const [u, setU] = React.useState('Gi')
    return (
      <div className="w-64 space-y-2">
        <Label>内存</Label>
        <QuantityInput
          value={v}
          onValueChange={setV}
          unit={u}
          onUnitChange={setU}
          units={['Mi', 'Gi', 'Ti']}
          min={0}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">提交值：{v}{u}</p>
      </div>
    )
  },
}

/** CPU（单一单位显示为静态文本；含交互断言：输入 999 blur 后钳制到 max=64） */
export const Cpu: Story = {
  render: function CpuStory() {
    const [v, setV] = React.useState(2)
    return (
      <div className="w-64 space-y-2">
        <Label>CPU</Label>
        <QuantityInput value={v} onValueChange={setV} units={['核']} min={0.5} max={64} step={0.5} className="w-full" />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const { expect, userEvent, within, waitFor } = await import('@storybook/test')
    const input = within(canvasElement).getByRole('textbox')
    // 编辑时不拦（能输入越界值），blur 时钳制归一——NumberField 同款约定
    await userEvent.clear(input)
    await userEvent.type(input, '999')
    await expect(input).toHaveValue('999')
    await userEvent.tab()
    await waitFor(() => expect(input).toHaveValue('64'))
  },
}

/** 无单位（退化为纯数值步进形态） */
export const NoUnit: Story = {
  render: function NoUnitStory() {
    const [v, setV] = React.useState(3)
    return <QuantityInput value={v} onValueChange={setV} min={1} max={10} className="w-40" />
  },
}

export const Disabled: Story = {
  render: () => (
    <QuantityInput value={6} onValueChange={() => {}} unit="Gi" units={['Mi', 'Gi']} disabled className="w-52" />
  ),
}
