import type { Meta, StoryObj } from '@storybook/react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card'
import { Button } from './button'

const meta: Meta<typeof HoverCard> = {
  title: 'Shadcn 原生/HoverCard',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix HoverCard' },
  component: HoverCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HoverCard>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@rise-global</Button>
      </HoverCardTrigger>
      <HoverCardContent className="text-sm">
        <p className="font-medium">Rise Global</p>
        <p className="mt-1 text-muted-foreground">
          基于 Kubernetes 的插件化多租户管理平台。
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
}
