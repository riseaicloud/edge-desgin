import type { Meta, StoryObj } from '@storybook/react'
import { LayoutDashboard, Activity, FileText, Lock, Bell, User } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Shadcn 原生/Tabs',
  parameters: { componentSubtitle: 'shadcn 原版 · Radix Tabs' },
  component: Tabs,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm">Make changes to your account here.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm">Change your password here.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm">Manage your settings.</p>
      </TabsContent>
    </Tabs>
  ),
}

/** 带图标：lucide 图标放 Trigger 内文字前（官网 Icons 示例同款用法） */
export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">
          <LayoutDashboard className="mr-1.5 h-4 w-4" />
          概览
        </TabsTrigger>
        <TabsTrigger value="monitoring">
          <Activity className="mr-1.5 h-4 w-4" />
          监控
        </TabsTrigger>
        <TabsTrigger value="logs">
          <FileText className="mr-1.5 h-4 w-4" />
          日志
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm">资源概览内容。</p>
      </TabsContent>
      <TabsContent value="monitoring">
        <p className="text-sm">监控图表内容。</p>
      </TabsContent>
      <TabsContent value="logs">
        <p className="text-sm">日志流内容。</p>
      </TabsContent>
    </Tabs>
  ),
}

/** 禁用某个 Tab（Radix 原生 disabled，键盘导航自动跳过） */
export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">概览</TabsTrigger>
        <TabsTrigger value="monitoring" disabled>
          监控（未开通）
        </TabsTrigger>
        <TabsTrigger value="logs">日志</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm">资源概览内容。</p>
      </TabsContent>
      <TabsContent value="logs">
        <p className="text-sm">日志流内容。</p>
      </TabsContent>
    </Tabs>
  ),
}

/** 纵向布局：Radix 的 orientation="vertical"（上下键导航），排版由使用方 flex 组织 */
export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="account" orientation="vertical" className="flex gap-4">
      <TabsList className="h-auto flex-col">
        <TabsTrigger value="account" className="w-full justify-start">
          <User className="mr-1.5 h-4 w-4" />
          账户
        </TabsTrigger>
        <TabsTrigger value="password" className="w-full justify-start">
          <Lock className="mr-1.5 h-4 w-4" />
          密码
        </TabsTrigger>
        <TabsTrigger value="notifications" className="w-full justify-start">
          <Bell className="mr-1.5 h-4 w-4" />
          通知
        </TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="account" className="mt-0">
          <p className="text-sm">账户设置内容。</p>
        </TabsContent>
        <TabsContent value="password" className="mt-0">
          <p className="text-sm">密码修改内容。</p>
        </TabsContent>
        <TabsContent value="notifications" className="mt-0">
          <p className="text-sm">通知偏好内容。</p>
        </TabsContent>
      </div>
    </Tabs>
  ),
}
