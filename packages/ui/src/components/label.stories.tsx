import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label'
import { Input } from './input'

const meta: Meta<typeof Label> = {
  title: 'Shadcn 原生/Label',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix Label' },
  component: Label,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  render: () => (
    <div className="w-72 space-y-2">
      <Label htmlFor="cluster-name">集群名称</Label>
      <Input id="cluster-name" placeholder="prod-cluster" />
    </div>
  ),
}
