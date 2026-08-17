import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CodeEditor } from './code-editor'
import { Label } from './label'

const meta: Meta<typeof CodeEditor> = {
  title: '二次封装/CodeEditor',
  parameters: { componentSubtitle: '自研 · monaco（React.lazy 动态加载）' },
  component: CodeEditor,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CodeEditor>

/** 启动命令场景（CAMP lumi-code-mirror-ide 同款用法，每行一条） */
export const Default: Story = {
  render: function DefaultStory() {
    const [v, setV] = React.useState('/bin/bash\n-c')
    return (
      <div className="w-[560px] space-y-2">
        <Label>启动命令</Label>
        <CodeEditor value={v} onChange={setV} language="shell" height={120} />
        <p className="text-xs text-muted-foreground">每行一条命令。</p>
      </div>
    )
  },
}

/** 空值占位提示 */
export const WithPlaceholder: Story = {
  render: function PlaceholderStory() {
    const [v, setV] = React.useState('')
    return (
      <div className="w-[560px]">
        <CodeEditor
          value={v}
          onChange={setV}
          language="shell"
          height={120}
          placeholder="/bin/bash"
        />
      </div>
    )
  },
}

/** 只读查看（YAML） */
export const ReadOnlyYaml: Story = {
  render: () => (
    <div className="w-[560px]">
      <CodeEditor
        readOnly
        language="yaml"
        height={180}
        value={'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 2'}
      />
    </div>
  ),
}

/** 浅色主题（与表单融合的场景） */
export const LightTheme: Story = {
  render: function LightStory() {
    const [v, setV] = React.useState('{\n  "replicas": 2\n}')
    return (
      <div className="w-[560px]">
        <CodeEditor value={v} onChange={setV} language="json" height={140} theme="light" />
      </div>
    )
  },
}
