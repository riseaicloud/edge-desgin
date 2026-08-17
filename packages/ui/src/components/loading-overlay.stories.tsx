import type { Meta, StoryObj } from '@storybook/react'
import { LoadingOverlay } from './loading-overlay'
import { useState } from 'react'

const meta: Meta<typeof LoadingOverlay> = {
  title: '二次封装/LoadingOverlay',
  parameters: { componentSubtitle: '自研 · 原生' },
  component: LoadingOverlay,
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof LoadingOverlay>

function DemoContent() {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Content Below Overlay</h3>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}

export const NotLoading: Story = {
  args: {
    loading: false,
  },
  render: (args) => (
    <div className="relative h-[300px] border rounded">
      <DemoContent />
      <LoadingOverlay {...args} />
    </div>
  ),
}

export const IsLoading: Story = {
  args: {
    loading: true,
  },
  render: (args) => (
    <div className="relative h-[300px] border rounded">
      <DemoContent />
      <LoadingOverlay {...args} />
    </div>
  ),
}

export const WithCustomText: Story = {
  args: {
    loading: true,
    text: "正在保存更改...",
  },
  render: (args) => (
    <div className="relative h-[300px] border rounded">
      <DemoContent />
      <LoadingOverlay {...args} />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [loading, setLoading] = useState(false)

    return (
      <div className="space-y-4">
        <div className="relative h-[300px] border rounded">
          <DemoContent />
          <LoadingOverlay loading={loading} text="正在处理..." />
        </div>
        <button
          onClick={() => setLoading(!loading)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "停止加载" : "开始加载"}
        </button>
      </div>
    )
  },
}
