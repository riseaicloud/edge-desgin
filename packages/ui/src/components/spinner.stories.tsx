import type { Meta, StoryObj } from '@storybook/react'
import { Spinner, Loading } from './spinner'

const meta: Meta<typeof Spinner> = {
  title: '二次封装/Spinner',
  parameters: { componentSubtitle: '自研 · 原生' },
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  args: {
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
}

export const LoadingState: Story = {
  render: () => (
    <div className="h-[200px] flex items-center justify-center">
      <Loading text="正在加载数据..." />
    </div>
  ),
}

export const CustomText: Story = {
  render: () => (
    <div className="space-y-4">
      <Loading text="Please wait..." />
      <Loading text="Submitting your changes..." />
    </div>
  ),
}
