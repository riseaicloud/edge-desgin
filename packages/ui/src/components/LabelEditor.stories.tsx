import type { Meta, StoryObj } from '@storybook/react'
import { LabelEditor } from './LabelEditor'

const meta = {
  title: '二次封装/LabelEditor',
  component: LabelEditor,
  parameters: {
    componentSubtitle: '自研 · 原生',
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LabelEditor>

export default meta
type Story = StoryObj<typeof LabelEditor>

export const Default: Story = {
  args: {
    value: [
      { key: 'app', value: 'my-app' },
      { key: 'env', value: 'production' },
    ],
    onChange: (value) => console.log('Value changed:', value),
  },
}

export const Empty: Story = {
  args: {
    value: [],
    onChange: (value) => console.log('Value changed:', value),
    emptyText: '暂无标签，点击下方添加',
  },
}

export const WithChangeDetection: Story = {
  args: {
    value: [
      { key: 'app', value: 'my-app' },
    ],
    initialValue: [
      { key: 'app', value: 'my-app' },
      { key: 'env', value: 'production' },
    ],
    onChange: (value) => console.log('Value changed:', value),
    showChangeDetection: true,
  },
}

export const Disabled: Story = {
  args: {
    value: [
      { key: 'app', value: 'my-app' },
      { key: 'env', value: 'production' },
    ],
    onChange: () => {},
    disabled: true,
  },
}

export const Annotations: Story = {
  args: {
    value: [
      { key: 'description', value: 'This is a long description that can span multiple lines' },
      { key: 'owner', value: 'team-alpha' },
    ],
    onChange: (value) => console.log('Value changed:', value),
    placeholderKey: '注解键',
    placeholderValue: '注解值',
    emptyText: '暂无注解',
    addButtonText: '添加注解',
  },
}

export const LongList: Story = {
  args: {
    value: Array.from({ length: 20 }, (_, i) => ({
      key: `label-${i + 1}`,
      value: `value-${i + 1}`,
    })),
    onChange: (value) => console.log('Value changed:', value),
    maxHeight: '20rem',
  },
}
