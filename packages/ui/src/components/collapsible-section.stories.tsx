import type { Meta, StoryObj } from '@storybook/react'
import { CollapsibleSection } from './collapsible-section'

const meta: Meta<typeof CollapsibleSection> = {
  title: '二次封装/CollapsibleSection',
  parameters: { componentSubtitle: '自研 · Radix Collapsible' },
  component: CollapsibleSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CollapsibleSection>

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <CollapsibleSection title="属性">
        <div className="text-sm text-muted-foreground">可折叠的属性区内容。</div>
      </CollapsibleSection>
    </div>
  ),
}
