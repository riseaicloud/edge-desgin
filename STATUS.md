# Edge Design System — 状态

> 最后更新 2026-08-17（封板冲刺期）。

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
| rise-global | **仅 tokens + ui**（自己的 scope 模型是 Workspace/Project，与 `components`/`hooks` 假设的 Cluster/Namespace 对不上） |

> **edge-console 不是消费方**（2026-08-14 LF 确认）：它是当年的提取源，组件全部本地内联
> （`src/components/ui/*`），不装 `@riseaicloud/*`。协同升级（如 Tailwind peer bump）只涉及
> 本仓 + rise-global 两处。

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

## 2026-08 大改（封板冲刺，PR 待合）

51+ 组件全量审计 + 增补，工作分支 `feat/tw34-breadcrumb-field`（changeset 池 10+ 张，验收后一次发版，预计 2.0.0）：

- **手搓债清零**：RadioGroup（1.3.2 前置修）/ Checkbox / Switch 换 Radix 原版；CollapsibleSection 换 Radix Collapsible 底座；PageHeader 手写 SVG → lucide
- **浮层 Portal 化收尾**：HoverCard 补 Portal、DateRangePicker 手写 absolute 浮层整体迁 Radix Popover——全包再无不 Portal 的浮层
- **Tailwind 3.4** + tokens peer `>=3.4`（消费方=仅 rise-global，需同批升级）
- **新组件 12+**：Field 家族（TW 降级适配）、Breadcrumb、SegmentedControl（四 variant）、CodeEditor（monaco lazy）、QuantityInput、HoverCard/PropertyHoverCard、UsageMeter、CopyButton/ResourceNameCell、Select 门面 selectAll、Sheet size 档、surface-monitor token
- **治理体系**：shadcn 对照表 + 组件血缘清单（docs/guide）、Storybook 按「Shadcn 原生 / 二次封装」双组重组 + 全量 story（59 组件）+ 血缘副标题、`pnpm lineage:lint` 三处一致性护栏
- monaco 改 React.lazy（barrel 不再静态背 monaco）；伪主题色清零（bg-foreground 当强调色 ×2）

## 待办（封板前）

| 优先级 | 事项 | 说明 |
|---|---|---|
| 高 | **暗色 + 偏好矩阵全量自检** | 新组件按 暗色 × 中性色主题 × 圆角 0 × 灰度 过一遍（A1） |
| 中 | **视觉回归基线** | 封板态截一次基线存档（Storybook test-runner），此后改动有对照（B1） |
| 中 | Story 交互态补强 | Select 全选 / QuantityInput 钳制 / Field 键盘导航等交互验证 story（B2） |

## 待办（封板后 / 触发式）

| 事项 | 触发条件 |
|---|---|
| **组件 i18n**（约 10 个组件可见中文，locale 注入契约未定） | 英文客户演示 / 海外交付；触发时预留 1 周设计契约 |
| `themes.ts` v2（chrome 皮肤折叠进 CSS 变量，公开 API 须 deprecate 路径） | 2.x 议题 |
| `docs/tailwind.config.js` 改用 preset | 顺手 |
| 剩余 shadcn 缺口（Slider / Calendar 单日期 / Kbd / Command） | 出现真实消费方，见对照表 |
| rise-global 消费侧收敛（散装 monaco→CodeEditor 等） | 封板发版后；**注意 monaco 离线 loader 约束**（内网禁 CDN，须 app 级 loader.config 先行） |

## 发布检查清单

发版前必跑：`pnpm lineage:lint`（血缘三处一致性）→ `pnpm --filter @riseaicloud/ui typecheck && build` → `pnpm build:docs` → Storybook 明暗两态抽查。

## 踩过的坑（避免重复发现）

| 坑 | 说明 |
|---|---|
| **Tailwind 会 content-match `addBase` 里的类选择器** | content 中没有 `dark` 字样时，整个 `.dark` 块被丢弃、暗色静默失效。preset 已内置 `safelist: ['dark']` |
| **打包会丢弃模块级指令** | 源码里 30 个组件写了 `"use client"`，产物里一个都没有。tsup 的 `banner` 也不行 —— `treeshake: true` 让 rollup 接手后处理，rollup 明确忽略模块级指令。只能构建后写回（见 `packages/ui/tsup.config.ts`） |
| **Storybook 不热重载 Tailwind preset** | 改完 token 后 Storybook 显示的仍是旧值，必须重启。视觉回归尤其致命 —— 基线可能整个是错的 |
| **`bg-background/80` 当遮罩 = 没有遮罩** | 浅色下算出来是 `hsl(0 0% 100% / .8)` 白色半透明。遮罩要压暗背景，不该跟随 `--background` 反转。暗色下 `--background` 变暗、遮罩反而"正常"，**恰好掩盖了浅色下的问题** |
| **变量定义复制一份必然漂移** | `ui/src/styles.css` 曾硬编码一套 `:root`/`.dark`，与 tokens 漂移 8 项且从未同步（`ring`(dark) 48% vs 94.1%）。现已删除，变量只从 preset 来 |
