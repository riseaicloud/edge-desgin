import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { ConfirmDialog } from './confirm-dialog'
import { Button } from './button'

const meta: Meta<typeof ConfirmDialog> = {
  title: '二次封装/ConfirmDialog',
  parameters: { componentSubtitle: '组合封装 · AlertDialog 底座' },
  component: ConfirmDialog,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ConfirmDialog>

export const Default: Story = {
  render: function ConfirmStory() {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>停止实例</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="停止实例"
          description="停止后实例内进程将被终止，可重新启动。"
          onConfirm={() => setOpen(false)}
        />
      </>
    )
  },
}
