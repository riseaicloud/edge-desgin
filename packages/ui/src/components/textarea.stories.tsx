import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Shadcn 原生/Textarea',
  parameters: { componentSubtitle: 'shadcn 原版 · 原生' },
  component: Textarea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: 'This is a default value in the textarea.',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'This textarea is disabled.',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <label htmlFor="message" className="text-sm font-medium">Message</label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  ),
}
