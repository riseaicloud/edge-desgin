import type { Meta, StoryObj } from '@storybook/react'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'

const meta: Meta<typeof ToggleGroup> = {
  title: 'Shadcn 原生/ToggleGroup',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix ToggleGroup' },
  component: ToggleGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ToggleGroup>

/** 允许全不选的筛选场景用它；必选的表单单选请用 SegmentedControl */
export const Single: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="cpu">
      <ToggleGroupItem value="cpu">CPU</ToggleGroupItem>
      <ToggleGroupItem value="memory">内存</ToggleGroupItem>
      <ToggleGroupItem value="gpu">GPU</ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={['error']}>
      <ToggleGroupItem value="info">Info</ToggleGroupItem>
      <ToggleGroupItem value="warn">Warn</ToggleGroupItem>
      <ToggleGroupItem value="error">Error</ToggleGroupItem>
    </ToggleGroup>
  ),
}
