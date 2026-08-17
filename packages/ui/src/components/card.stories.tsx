import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'

const meta: Meta<typeof Card> = {
  title: 'Shadcn 原生/Card',
  parameters: { componentSubtitle: 'shadcn 原版 · 原生' },
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
      <CardFooter>
        <p>Card footer</p>
      </CardFooter>
    </Card>
  ),
}

export const WithAllParts: Story = {
  render: () => (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Project Launch</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Make changes to your project here and click deploy.</p>
        </CardContent>
        <CardFooter>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Deploy
          </button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Enter your information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  ),
}

export const Minimal: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardContent className="pt-6">
        <p className="text-sm">Simple card with just content.</p>
      </CardContent>
    </Card>
  ),
}
