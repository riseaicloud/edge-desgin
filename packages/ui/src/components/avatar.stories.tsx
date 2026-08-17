import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Shadcn 原生/Avatar',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix Avatar' },
  component: Avatar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
        <AvatarFallback>RG</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/broken-link.png" alt="fallback demo" />
        <AvatarFallback>徐</AvatarFallback>
      </Avatar>
    </div>
  ),
}
