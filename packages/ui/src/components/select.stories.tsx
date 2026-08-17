import type { Meta, StoryObj } from '@storybook/react'
import {
  SelectRoot, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from './select'

const meta: Meta<typeof SelectRoot> = {
  title: 'Shadcn 原生/SelectRoot',
  parameters: { componentSubtitle: 'shadcn 原版（组合式，深度定制用；一行用请走门面 Select） · Radix Select' },
  component: SelectRoot,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SelectRoot>

export const Default: Story = {
  render: () => (
    <SelectRoot defaultValue="oversub_gpu">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="选择类型" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="private_gpu">算力独享</SelectItem>
        <SelectItem value="oversub_gpu">算力超分</SelectItem>
        <SelectItem value="shared_gpu">算力共享</SelectItem>
        <SelectItem value="cpu">仅 CPU</SelectItem>
      </SelectContent>
    </SelectRoot>
  ),
}
