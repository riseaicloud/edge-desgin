import type { Meta, StoryObj } from '@storybook/react'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Button } from './button'

const meta: Meta<typeof Popover> = {
  title: 'Shadcn 原生/Popover',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix Popover' },
  component: Popover,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">查看配置</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm">
        浮层内容：适合放轻量的补充信息或小表单。
      </PopoverContent>
    </Popover>
  ),
}
