import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Select, type SelectOption } from './select-facade'

/**
 * 平台下拉的唯一推荐入口。选型口诀：
 * - 固定枚举（≤10 项、写死的）：`<Select options value onValueChange />`
 * - 选项多、来自接口：加 `searchable`（+`onSearch` 远程 / `onLoadMore` 滚动分页，
 *   配 `@riseaicloud/hooks` 的 `useSelectOptions` 一行接入）
 * - 多选：`multiple values onValuesChange`
 * - 深度定制才用积木 `SelectRoot/SelectTrigger/...`；业务选择器（选集群/镜像/用户）
 *   用 `@riseaicloud/components`，别在页面里拼
 */
const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof Select>

const FRUITS: SelectOption[] = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'cherry', label: '樱桃' },
  { value: 'durian', label: '榴莲', disabled: true },
  { value: 'elderberry', label: '接骨木莓' },
]

/** 固定枚举（Radix 引擎）：最常见形态，一行用。 */
export const Basic: Story = {
  render: () => {
    const [v, setV] = useState('')
    return <Select options={FRUITS} value={v} onValueChange={setV} width={220} />
  },
}

/** 可搜索（combobox 引擎）：选项超过 ~10 个就该加 searchable。 */
export const Searchable: Story = {
  render: () => {
    const [v, setV] = useState('')
    return (
      <Select
        options={FRUITS}
        value={v}
        onValueChange={setV}
        searchable
        clearable
        width={220}
      />
    )
  },
}

/** 多选：trigger 显示已选摘要，点选项不关闭浮层。 */
export const Multiple: Story = {
  render: () => {
    const [vs, setVs] = useState<string[]>(['apple'])
    return (
      <Select
        options={FRUITS}
        multiple
        values={vs}
        onValuesChange={setVs}
        searchable
        clearable
        width={220}
      />
    )
  },
}

/** 远程搜索 + 滚动分页：生产环境用 useSelectOptions(fetcher) 一行接入，
 *  这里手写模拟后端（page/pageSize/keyword → items/total 约定）。 */
export const RemotePaginated: Story = {
  render: () => {
    const PAGE_SIZE = 8
    const ALL = Array.from({ length: 57 }, (_, i) => ({
      value: `user-${i + 1}`,
      label: `用户 ${i + 1} 号`,
    }))
    const [v, setV] = useState('')
    const [opts, setOpts] = useState<SelectOption[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [query, setQuery] = useState('')
    const [total, setTotal] = useState(0)

    const fetchPage = (p: number, q: string) => {
      setLoading(true)
      setTimeout(() => {
        const filtered = ALL.filter((o) => o.label.includes(q))
        setTotal(filtered.length)
        const items = filtered.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE)
        setOpts((prev) => (p === 1 ? items : [...prev, ...items]))
        setPage(p)
        setLoading(false)
      }, 400)
    }

    return (
      <Select
        options={opts}
        value={v}
        onValueChange={setV}
        searchable
        clearable
        loading={loading}
        hasMore={page * PAGE_SIZE < total}
        onOpen={() => opts.length === 0 && fetchPage(1, '')}
        onSearch={(q) => {
          setQuery(q)
          fetchPage(1, q)
        }}
        onLoadMore={() => fetchPage(page + 1, query)}
        placeholder="选择用户（57 条，滚动翻页）"
        width={260}
      />
    )
  },
}

/** 对钩靠右（checkAlign="right"）：两个引擎统一生效，默认在左。 */
export const CheckAlignRight: Story = {
  render: () => {
    const [v, setV] = useState('banana')
    const [v2, setV2] = useState('cherry')
    return (
      <div className="flex flex-col gap-3">
        <Select options={FRUITS} value={v} onValueChange={setV} checkAlign="right" width={220} />
        <Select options={FRUITS} value={v2} onValueChange={setV2} checkAlign="right" searchable width={220} />
      </div>
    )
  },
}

/** 选项 icon + 文本：options 的 icon 字段，trigger 选中态同样带 icon。 */
export const WithIcons: Story = {
  render: () => {
    const [v, setV] = useState('gpu')
    const dot = (c: string) => (
      <span className={`inline-block h-2 w-2 rounded-full ${c}`} />
    )
    const opts: SelectOption[] = [
      { value: 'gpu', label: 'GPU 节点', icon: dot('bg-green-500') },
      { value: 'cpu', label: 'CPU 节点', icon: dot('bg-blue-500') },
      { value: 'edge', label: '边缘节点', icon: dot('bg-amber-500') },
      { value: 'down', label: '离线节点', icon: dot('bg-gray-400'), disabled: true },
    ]
    return (
      <div className="flex flex-col gap-3">
        <Select options={opts} value={v} onValueChange={setV} width={220} />
        <Select options={opts} value={v} onValueChange={setV} searchable clearable width={220} />
      </div>
    )
  },
}

/** 禁用整体 / 禁用单项（榴莲）。 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Select options={FRUITS} value="apple" disabled width={220} />
      <Select options={FRUITS} placeholder="榴莲不可选" width={220} />
    </div>
  ),
}
