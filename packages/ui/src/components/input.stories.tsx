import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta = {
  title: 'Shadcn 原生/Input',
    component: Input,
  parameters: {
    componentSubtitle: 'shadcn 原版 · 原生',
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: '请输入...',
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: 'Hello World',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Disabled input',
  },
}

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
    </div>
  ),
}
