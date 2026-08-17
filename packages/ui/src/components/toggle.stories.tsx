import type { Meta, StoryObj } from '@storybook/react'
import { Bold } from 'lucide-react'
import { Toggle } from './toggle'

const meta: Meta<typeof Toggle> = {
  title: 'Shadcn 原生/Toggle',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix Toggle' },
  component: Toggle,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: () => (
    <Toggle aria-label="加粗">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
}
