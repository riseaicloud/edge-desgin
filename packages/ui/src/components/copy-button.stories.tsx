import type { Meta, StoryObj } from '@storybook/react'
import { CopyButton } from './copy-button'

const meta: Meta<typeof CopyButton> = {
  title: '二次封装/CopyButton',
  parameters: { componentSubtitle: '自研（含 HTTP 非安全上下文剪贴板兜底） · 原生 clipboard' },
  component: CopyButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CopyButton>

/** 点击复制，✓ 反馈 1.5s；HTTP 环境自动走 execCommand 兜底 */
export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-muted-foreground">39A12A64-010074F2-6632A633</span>
      <CopyButton text="39A12A64-010074F2-6632A633" />
    </div>
  ),
}
