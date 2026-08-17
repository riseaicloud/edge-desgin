import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { CreateResourceDialog } from './create-resource-dialog'
import { Button } from './button'

const meta: Meta<typeof CreateResourceDialog> = {
  title: '二次封装/CreateResourceDialog',
  parameters: { componentSubtitle: '组合封装 · Dialog 底座' },
  component: CreateResourceDialog,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CreateResourceDialog>

export const Default: Story = {
  render: function CreateStory() {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>YAML 创建</Button>
        <CreateResourceDialog
          open={open}
          onOpenChange={setOpen}
          title="创建资源"
          description="粘贴 YAML 创建任意 K8s 资源。"
          defaultYaml={'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: demo'}
          onConfirm={() => setOpen(false)}
        />
      </>
    )
  },
}
