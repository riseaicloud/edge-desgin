import type { Meta, StoryObj } from '@storybook/react'
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from './sheet'
import { Button } from './button'

const meta: Meta<typeof Sheet> = {
  title: 'Shadcn 原生/Sheet',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix Dialog' },
  component: Sheet,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Sheet>

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">打开抽屉</Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] max-w-full sm:max-w-none">
        <SheetHeader>
          <SheetTitle>编辑配置</SheetTitle>
          <SheetDescription>标准表单默认进 600px 抽屉（md 档）。</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}
