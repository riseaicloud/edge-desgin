import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea } from './scroll-area'

const meta: Meta<typeof ScrollArea> = {
  title: 'Shadcn 原生/ScrollArea',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix ScrollArea' },
  component: ScrollArea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ScrollArea>

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-40 w-56 rounded border p-3">
      <div className="space-y-2 text-sm">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i}>worker-node-{i}</div>
        ))}
      </div>
    </ScrollArea>
  ),
}
