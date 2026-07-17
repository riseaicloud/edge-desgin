# Edge Design System — 状态

> 最后更新 2026-07-17。

## 架构

```
@riseaicloud/tokens       Layer 1 — CSS 变量 + JS 常量 + Tailwind preset
@riseaicloud/ui           Layer 2 — 通用 UI（只吃 props）
@riseaicloud/components   Layer 3 — 业务组件（知道 Edge 概念，不自己发请求）
@riseaicloud/hooks        数据 hooks（知道 API 契约，连接信息由使用者注入）+ 通用 hooks
```

依赖：`tokens ← ui ← components`；`hooks` 独立无依赖。归属规则见 [EXTRACTION_GUIDE.md](./EXTRACTION_GUIDE.md)。

> **包名**：早期文档写的 `@edge/*` 已全部改为 `@riseaicloud/*`（发公有 npm）。

## 消费方

| 项目 | 用了哪些层 |
|---|---|
| edge-console | 四层 |
| rise-global | **仅 tokens + ui**（自己的 scope 模型是 Workspace/Project，与 `components`/`hooks` 假设的 Cluster/Namespace 对不上） |

## 已完成

**Layer 1 · tokens**
- 语义 token（`:root` / `.dark` 双套，HSL 通道值）+ Tailwind preset
- **surface scale**（`bg-surface-page` / `-toolbar` / `-section` / `-dialog-header`）——
  对应 edge-console 里 `#EFF4F9`/`#F9FBFD`/`#F5F7FA` 那 650+ 处硬编码
- cockpit / topology / status / chart 调色板，**含暗色覆盖**
- 6 套 chrome 主题（`getTheme` / `registerTheme`）

**Layer 2 · ui** — 69 个组件。SearchableSelect / StatusIndicator / ConfirmDialog / ProgressRing /
CollapsibleSection / DataTable / PageHeader / DateRangePicker + 完整 shadcn 基座。

**Layer 3 · components** — ContainerStatus / ResourceNameDescription / ReplicaAdjustmentCard /
ReplicaConfirmationDialog / MonitoringChart / ClusterSelector / NamespaceSelector /
WorkspaceSelector / NodeGroupSelector（均 props 注入，不自己发请求）。

**hooks** — `useClusters` / `useNamespaces` / `useWorkspaces` / `useNodeGroups`（`ApiClientConfig`
注入连接信息）+ `useWizard` / `useLocalStorage` / `useDebouncedValue` / `useAutoRefresh` 等。

**基建** — Storybook、Nextra 文档站（3030）、Changesets、CI 发布（手动触发）。

## 待办

| 优先级 | 事项 | 说明 |
|---|---|---|
| 中 | **组件 i18n** | 69 个组件里 **22 个硬编码中文**（「确定」「取消」「暂无数据」），且零 i18n 机制。**方案待定** —— 需先确定组件库如何暴露 locale（候选方向：ConfigProvider 式的 context 注入，与「react-query 应由使用者注入」同一条原则；但具体契约未定，不写进 EXTRACTION_GUIDE） |
| 中 | **组件去硬编码色** | 残留 `text-gray-700` / `bg-blue-600` / `border-gray-200` 等固定色，不跟主题。**与组件 i18n 是同一批文件，应在同一批 PR 做完** |
| 中 | **视觉回归** | 改 69 个组件的颜色 × 明暗两套，没有视觉回归就是盲改。已有 `.stories.tsx` 打底 |
| 中 | `sideEffects: false` + monaco 改 dynamic import | 包无 `sideEffects` 声明且 `dist/index.mjs` static import `@monaco-editor/react`，barrel import 可能拉入整个编辑器 |
| 低 | `docs/tailwind.config.js` 改用 preset | 文档站自己没用 preset，手写了一份 extend —— 教别人配 preset，自己不用 |
| 低 | `themes.ts` v2 | 6 套 chrome 主题目前是 Tailwind class 串（`bg-[#1e293b]`），与 CSS 变量体系并行。折叠进变量时**它是公开 API，须走 deprecate 路径** |
| 低 | 源码 `"use client"` 补齐 | 整包已由 tsup `onSuccess` 统一加 banner；源码指令只影响直接 import `src/` 的场景 |

## 踩过的坑（避免重复发现）

| 坑 | 说明 |
|---|---|
| **Tailwind 会 content-match `addBase` 里的类选择器** | content 中没有 `dark` 字样时，整个 `.dark` 块被丢弃、暗色静默失效。preset 已内置 `safelist: ['dark']` |
| **打包会丢弃模块级指令** | 源码里 30 个组件写了 `"use client"`，产物里一个都没有。tsup 的 `banner` 也不行 —— `treeshake: true` 让 rollup 接手后处理，rollup 明确忽略模块级指令。只能构建后写回（见 `packages/ui/tsup.config.ts`） |
| **Storybook 不热重载 Tailwind preset** | 改完 token 后 Storybook 显示的仍是旧值，必须重启。视觉回归尤其致命 —— 基线可能整个是错的 |
| **`bg-background/80` 当遮罩 = 没有遮罩** | 浅色下算出来是 `hsl(0 0% 100% / .8)` 白色半透明。遮罩要压暗背景，不该跟随 `--background` 反转。暗色下 `--background` 变暗、遮罩反而"正常"，**恰好掩盖了浅色下的问题** |
| **变量定义复制一份必然漂移** | `ui/src/styles.css` 曾硬编码一套 `:root`/`.dark`，与 tokens 漂移 8 项且从未同步（`ring`(dark) 48% vs 94.1%）。现已删除，变量只从 preset 来 |
