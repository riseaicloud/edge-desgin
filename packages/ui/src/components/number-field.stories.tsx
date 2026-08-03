import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { NumberField } from './number-field'

const meta: Meta<typeof NumberField> = {
  title: 'Components/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof NumberField>

/** 受控包装 —— NumberField 本身不持有值，story 里需要一层 state 才能交互。 */
function Controlled({ initial = 16, ...props }: { initial?: number } & Record<string, unknown>) {
  const [value, setValue] = useState(initial)
  return <NumberField value={value} onValueChange={setValue} {...props} />
}

export const Default: Story = {
  render: () => (
    <div className="w-48">
      <Controlled />
    </div>
  ),
}

/** 典型用法：字号偏好。单位放组件外，不做成 prop —— 它随场景变化。 */
export const WithUnit: Story = {
  render: () => (
    <div className="flex w-56 items-center gap-2">
      <Controlled initial={16} min={15} max={22} className="w-full" />
      <span className="whitespace-nowrap text-xs text-muted-foreground">px</span>
    </div>
  ),
}

/** 到达边界时对应的按钮自动禁用（这里初始值即上界）。 */
export const AtBoundary: Story = {
  render: () => (
    <div className="w-48">
      <Controlled initial={22} min={15} max={22} />
    </div>
  ),
}

export const CustomStep: Story = {
  render: () => (
    <div className="w-48">
      <Controlled initial={200} min={0} max={1000} step={50} />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-48">
      <Controlled disabled />
    </div>
  ),
}
