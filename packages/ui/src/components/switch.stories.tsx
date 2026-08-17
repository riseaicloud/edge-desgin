import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './switch'

const meta: Meta<typeof Switch> = {
  title: 'Shadcn 原生/Switch',
  parameters: { componentSubtitle: 'shadcn 适配（尺寸 h-5 w-9） · Radix Switch' },
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Off: Story = {
  args: {
    checked: false,
  },
}

export const On: Story = {
  args: {
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center justify-between">
      <span className="text-sm">Airplane Mode</span>
      <Switch />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm">Notifications: {checked ? 'On' : 'Off'}</span>
        <Switch checked={checked} onCheckedChange={setChecked} />
      </div>
    )
  },
}
