import type { Meta, StoryObj } from '@storybook/react'
import { Form, FormField, FormLabel, FormControl, FormDescription, FormMessage } from './form'
import { Input } from './input'

const meta: Meta<typeof Form> = {
  title: '二次封装/Form',
  parameters: { componentSubtitle: '自研（⚠ 非 react-hook-form 版；Form*=校验绑定，Field*=布局） · 原生 form' },
  component: Form,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Form>

export const Default: Story = {
  render: () => (
    <Form className="w-80">
      <FormField id="name">
        <FormLabel>名称</FormLabel>
        <FormControl>
          <Input placeholder="my-workspace" />
        </FormControl>
        <FormDescription>3–63 个字符。</FormDescription>
      </FormField>
      <FormField id="quota" error="配额必须为正整数">
        <FormLabel>配额</FormLabel>
        <FormControl>
          <Input defaultValue="-1" />
        </FormControl>
        <FormMessage />
      </FormField>
    </Form>
  ),
}
