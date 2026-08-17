import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { YamlEditDialog } from './yaml-edit-dialog'
import { Button } from './button'

const meta: Meta<typeof YamlEditDialog> = {
  title: '二次封装/YamlEditDialog',
  parameters: { componentSubtitle: '组合封装 · Dialog + monaco（React.lazy 动态加载）' },
  component: YamlEditDialog,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof YamlEditDialog>

/** 编辑器本体运行时从 CDN 加载，首开会有「加载编辑器...」占位 */
export const Default: Story = {
  render: function YamlStory() {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>编辑 YAML</Button>
        <YamlEditDialog
          open={open}
          onOpenChange={setOpen}
          title="编辑 Deployment"
          initialYaml={'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web'}
          onConfirm={async () => setOpen(false)}
        />
      </>
    )
  },
}
