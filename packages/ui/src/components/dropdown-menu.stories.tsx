import type { Meta, StoryObj } from '@storybook/react'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from './dropdown-menu'
import { Button } from './button'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Shadcn 原生/DropdownMenu',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix DropdownMenu' },
  component: DropdownMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">操作</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>查看详情</DropdownMenuItem>
        <DropdownMenuItem>编辑</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">删除</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
