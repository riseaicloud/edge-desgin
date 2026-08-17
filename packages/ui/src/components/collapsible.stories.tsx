import type { Meta, StoryObj } from '@storybook/react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'
import { Button } from './button'

const meta: Meta<typeof Collapsible> = {
  title: 'Shadcn 原生/Collapsible',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix Collapsible' },
  component: Collapsible,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: () => (
    <Collapsible className="w-72 space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">展开 / 收起</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded border p-3 text-sm">
        被折叠的内容区域。
      </CollapsibleContent>
    </Collapsible>
  ),
}
