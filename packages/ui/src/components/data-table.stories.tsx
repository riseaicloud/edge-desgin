import type { Meta, StoryObj } from '@storybook/react'
import { DataTable, type ColumnDef } from './data-table'

interface Node {
  uuid: string
  name: string
  role: string
  status: 'Ready' | 'NotReady'
  cpu: string
}

const rows: Node[] = [
  { uuid: 'n1', name: 'master-0', role: 'control-plane', status: 'Ready', cpu: '32c' },
  { uuid: 'n2', name: 'worker-0', role: 'worker', status: 'Ready', cpu: '64c' },
  { uuid: 'n3', name: 'worker-1', role: 'worker', status: 'NotReady', cpu: '64c' },
]

const columns: ColumnDef<Node>[] = [
  { key: 'name', title: '名称', searchable: true, render: (r) => <span className="font-medium">{r.name}</span> },
  { key: 'role', title: '角色', width: 160 },
  {
    key: 'status', title: '状态', width: 120, searchable: true, searchType: 'select',
    searchOptions: [{ label: 'Ready', value: 'Ready' }, { label: 'NotReady', value: 'NotReady' }],
    render: (r) => (
      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${
        r.status === 'Ready' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
      }`}>{r.status}</span>
    ),
  },
  { key: 'cpu', title: 'CPU', width: 100 },
]

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof DataTable<Node>>

export const Default: Story = {
  render: () => <DataTable mode="static" data={rows} rowKey="uuid" columns={columns} />,
}

export const WithRowActions: Story = {
  render: () => (
    <DataTable
      mode="static" data={rows} rowKey="uuid" columns={columns}
      actionsTitle="操作"
      rowActions={[
        { label: '详情', onClick: (r) => alert(r.name) },
        { label: '驱逐', danger: true, disabled: (r) => r.role === 'control-plane', onClick: (r) => alert(r.name) },
      ]}
    />
  ),
}

export const Loading: Story = {
  render: () => <DataTable mode="static" data={[]} rowKey="uuid" columns={columns} loading />,
}

export const Empty: Story = {
  render: () => <DataTable mode="static" data={[]} rowKey="uuid" columns={columns} emptyText="暂无节点" />,
}
