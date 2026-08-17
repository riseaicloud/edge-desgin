import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { NameConfirmDeleteDialog } from './name-confirm-delete-dialog'
import { Button } from './button'

const meta: Meta<typeof NameConfirmDeleteDialog> = {
  title: '二次封装/NameConfirmDeleteDialog',
  parameters: { componentSubtitle: '组合封装 · AlertDialog + Checkbox' },
  component: NameConfirmDeleteDialog,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NameConfirmDeleteDialog>

/** 不可恢复的危险删除：输入资源名确认（集群/工作空间/节点组） */
export const Default: Story = {
  render: function NameDeleteStory() {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>删除集群</Button>
        <NameConfirmDeleteDialog
          open={open}
          onOpenChange={setOpen}
          resourceType="集群"
          resourceIdentifier="prod-cluster"
          extraDescription="集群内全部工作负载与数据将被清空。"
          onConfirm={async () => setOpen(false)}
        />
      </>
    )
  },
}
