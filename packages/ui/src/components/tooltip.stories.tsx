import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip'
import { Button } from './button'

const meta: Meta<typeof Tooltip> = {
  title: 'Shadcn 原生/Tooltip',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix Tooltip' },
  component: Tooltip,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">悬停查看</Button>
        </TooltipTrigger>
        <TooltipContent>节点处于维护模式，暂不可调度</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
