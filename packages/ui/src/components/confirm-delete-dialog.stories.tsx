import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { ConfirmDeleteDialog } from './confirm-delete-dialog'
import { Button } from './button'

const meta: Meta<typeof ConfirmDeleteDialog> = {
  title: '二次封装/ConfirmDeleteDialog',
  parameters: { componentSubtitle: '组合封装 · AlertDialog 底座' },
  component: ConfirmDeleteDialog,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ConfirmDeleteDialog>

export const Default: Story = {
  render: function DeleteStory() {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>删除</Button>
        <ConfirmDeleteDialog
          open={open}
          onOpenChange={setOpen}
          title="删除容器"
          description="以下容器将被删除，此操作不可恢复："
          itemNames={['web-7f9c', 'worker-a1b2']}
          onConfirm={async () => setOpen(false)}
        />
      </>
    )
  },
}
