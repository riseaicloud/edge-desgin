# 组件归属与提取边界

> 判断一个组件/hook 该放哪一层，以及什么绝对不能进这个仓库。
> 分层模型见 [STATUS.md](./STATUS.md)。

## 四层模型

| 层 | 包 | 知道什么 | 绝对禁止 |
|---|---|---|---|
| 1 | `@riseaicloud/tokens` | 颜色、间距、字体、动效 | 任何 React 代码 |
| 2 | `@riseaicloud/ui` | 只知道 props | 业务概念、fetch、URL/scope 判断 |
| 3 | `@riseaicloud/components` | 可以知道 Edge 概念（Cluster / Namespace / NodeGroup…） | **自己发起请求** |
| — | `@riseaicloud/hooks` | Edge **API 契约**（端点形状、返回类型） | 硬编码 baseUrl / token / 鉴权方式 |

**判断顺序**：能只吃 props 渲染吗 → Layer 2。需要理解 Edge 的资源概念吗 → Layer 3。要拿数据吗 → hooks，且**连接信息由使用者注入**。

## Layer 3 与 hooks 的关键约束：数据由使用者注入

业务组件**可以**进这个仓库 —— 前提是它自己不发请求。

```tsx
// ❌ 组件自己调 API：锁死了 baseUrl、鉴权、错误处理，消费方无法替换
export function ClusterSelector() {
  const [data, setData] = useState()
  useEffect(() => { listClusters().then(setData) }, [])   // ← 禁止
  return <SearchableSelect options={data} />
}

// ✅ 组件吃 props，数据从外面来
export function ClusterSelector({ clusters, value, onChange }: Props) {
  return <SearchableSelect options={clusters} value={value} onChange={onChange} />
}

// ✅ 需要开箱即用的数据层就用 hooks —— 连接信息由使用者注入
const { data } = useClusters({ baseUrl, token })
```

`useClusters` / `useNamespaces` / `useWorkspaces` / `useNodeGroups` 知道 Edge 的 API 契约
（`${baseUrl}/clusters` 的形状、`Cluster` 的字段），但**不知道**服务在哪、怎么鉴权 —— 那是
`ApiClientConfig` 传进来的。这条线让 hooks 对任何实现同一 API 契约的后端都可用。

> **历史**：本文件曾写「❌ ClusterSelector / NamespaceSelector / NodeSelector 禁止进入 —— 
> 原因：内部直接调用 edge-apiserver API」。那条规则把「组件是业务的」和「组件自己发请求」
> 混为一谈了。EDG-47/EDG-23/EDG-24 已按 props 注入重构并放进 Layer 3 / hooks，规则却没跟着
> 更新，导致**宪法与实践长期矛盾**。真正的红线是**自己发请求**，不是**知道业务概念**。

## 绝对不能进这个仓库

| | 为什么 |
|---|---|
| **依赖 Kubb 生成类型的组件**（引用 `src/gen/*`） | 与某个 OpenAPI 快照紧耦合，消费方版本一变就崩 |
| **硬编码 baseUrl / token / 鉴权方式的代码** | 见上：连接信息必须注入 |
| **绑定某个状态管理 / 数据库 / 路由库的组件** | 见「依赖规则」 |
| **只服务单一消费方的一次性页面** | 设计系统不是代码仓库 |

## 依赖规则

**允许**：`@radix-ui/*`、`lucide-react`、`class-variance-authority`、`clsx` / `tailwind-merge`、
`recharts`、`date-fns`。

**禁止**：

| | 为什么 |
|---|---|
| `@tanstack/react-query` 等数据层 | **应由使用者注入** —— 消费方可能用 SWR、可能用 RSC、可能什么都不用 |
| **i18n 引擎**（`i18next` / `react-intl` / …） | 同理。组件的内建文案走 `EdgeConfigProvider`（纯 context、零依赖），**不绑引擎** |
| 路由库（`react-router` / `next/link`） | 导航方式由消费方决定，组件通过 `onNavigate` 之类的 prop 上抛 |
| Kubb 生成的 API client / `src/gen/*` 的类型 | 见上 |

> 这几条是同一条原则的不同侧面：**框架级选型属于使用者，库不替他们决定**。

## 类型处理

组件 props 里不直接使用 K8s / OpenAPI 生成的类型，在包内重新定义最小结构：

```tsx
// ❌
import { Namespace } from '@/gen/types'
interface Props { namespace: Namespace }

// ✅ 只声明真正用到的字段
interface Resource { metadata: { name: string } }
interface Props<T extends Resource> { resource: T }
```

## 提取示例

**原始（edge-console）**：

```tsx
import { updateClusterResource } from '@/gen/api'
export function EditLabelsDialog({ clusterId, ... }) {
  const handleSave = async () => { await updateClusterResource({ ... }) }
}
```

**提取后（Layer 2）**：

```tsx
interface LabelEditorProps {
  value: Array<{ key: string; value: string }>
  onChange: (value: Array<{ key: string; value: string }>) => void
}
export function LabelEditor({ value, onChange }: LabelEditorProps) {
  // 纯 UI，不知道 cluster 是什么，更不知道怎么保存
}
```

**消费方（edge-console）**：

```tsx
import { LabelEditor } from '@riseaicloud/ui'
import { updateClusterResource } from '@/gen/api'

export function EditLabelsDialog({ clusterId, ... }) {
  const handleSave = async (labels) => { await updateClusterResource({ ... }) }
  return <LabelEditor value={labels} onChange={handleChange} />
}
```

## 样式约束

- **颜色一律走语义 token**（`bg-card` / `text-muted-foreground` / `bg-surface-page`），
  禁止 hex 字面量与固定灰（`text-gray-500` / `bg-blue-600`）—— 它们不跟主题。
- 遮罩这类**语义上恒定**的颜色例外（`bg-black/80`）：遮罩要压暗背景，跟着 `--background`
  反转反而会在浅色下变成白色蒙层、形同虚设。**「是不是 token」和「语义对不对」是两件事。**
- 组件**不自带样式表**：class 由消费方的 Tailwind 扫描生成（见 `docs/guide/installation`），
  所以消费方必须配 preset + 把本包 `dist` 加进 `content`。
