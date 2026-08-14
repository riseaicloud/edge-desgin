# @riseaicloud/tokens

## 1.3.1

## 1.2.0

### Minor Changes

- 7a12f1a: 新增 `buildPrimaryTheme(light, dark?)` —— 由品牌色算出明暗两态的主色与前景色

  换主色的机制是覆盖 `--primary`，但一个主色不是一个 hex：它是四个值（浅色主色、暗色主色、
  以及两种模式下**各自**的前景色）。后两个最容易做错 —— `darkColors['primary-foreground']`
  是近黑（因为 tokens 的暗色 `--primary` 是亮蓝），一旦把暗色主色换成偏深的彩色，近黑前景
  就读不了了。这部分交给本包算，消费方只给色值。

  前景色判据是阈值而非取最大对比度：白字对比度 < 3.5 才翻深字。取最大会把常规品牌蓝也判成
  深字（白 4.81 / 深 4.34，两者接近），而蓝底黑字不是任何设计系统的做法。

  **只给算法、不给主题目录**：「对外提供哪几个主题、叫什么名」是产品决策，随时增删；固化成
  公开 API 会让加删主题变成版本事件。同仓 `themes.ts` 即前车之鉴 —— 6 套皮肤发成公开 API、
  库内零引用，现在想折叠进变量体系必须走 deprecate。目录留在消费方，加主题改一行不发包。

  一并导出 `hexToHslChannels` 与 `PrimaryTheme` 类型 —— 算出的值不满意可直接给字面量完全手控。

- 7a12f1a: 新增 `--font-size-base` 正文基准字号 token

  与 `--radius` 同性质的可覆盖杠杆：消费方在 `:root` 或 `<html>` 上改一个值，正文字号跟随，
  用于支撑"字号偏好"这类用户可调项。preset 在 `:root` 注入默认值并在 base 层作用到 `body`。

  刻意只作用 `body`、不动根 `font-size` —— Tailwind 的间距与字号刻度全是 rem，动根字号会把
  整套布局一起缩放。组件自身的 `text-xs` / `text-sm` 是绝对 rem 值，不受影响。

  默认 `16px` = `fontSize.base`(1rem) = 浏览器默认，所以现有消费方视觉零变化。
  同时导出 `fontSizeBase` 常量。

  另修 preset 里 `--radius` 硬写字面量 `'0.5rem'` 的问题 —— `radiusBase` 常量早已存在但没被
  引用，改 token 会漏掉注入点。现改为引用常量。

## 1.1.0

### Minor Changes

- d265b55: 新增 surface 语义 token（`bg-surface-page` / `-toolbar` / `-section` / `-dialog-header`），
  暗色改为镜像浅色的层次模型；统一变量真源；移除失效的 `./styles` export。

  - **tokens**：`surfaceColors` 的 hex 值（`#EFF4F9`/`#F9FBFD`/`#F5F7FA`/`#F9FBFF`）机械转 HSL 后
    进入 `lightColors`/`darkColors`，由 preset 自动注入 CSS 变量并生成 Tailwind 类。浅色视觉零变化。
    旧的 `surfaceColors` hex 导出标记 `@deprecated`（只能用于 inline style，永远不跟主题），2.0 移除。
  - **tokens**：`darkColors.card` 从 `222.2 84% 4.9%`（与 background 同色的 shadcn 扁平模型）改为
    `217 33% 13%`，与浅色「灰底 + 白卡浮起」的设计语言一致，也避免 card 比 surface-page 更暗的倒挂。
  - **tokens**：preset 加 `safelist: ['dark']`。Tailwind 会 content-match `addBase` 里的类选择器，
    消费方若只用 JS 切 class、源码没有任何 `dark:` 字面量，整个 `.dark` 块会被丢弃、暗色静默失效。
  - **ui**：`styles.css` 删除硬编码的 `:root`/`.dark` 变量块。它与 tokens 漂移了 8 项且从未同步
    （`ring`(dark) 这里 48%、tokens 94.1%），且只被 Storybook import —— 消费方一直拿 preset 的值，
    所以线上无恙，但 Storybook 的视觉基线是错的。变量 now 只从 preset 来。
  - **ui**：`pagination.tsx` 的 inline `#F9FBFD` 改为 `bg-surface-toolbar`。
  - **ui**：移除 `exports` 里的 `"./styles"` —— 它指向的 `dist/styles.css` 从不存在（tsup entry 只有
    `index.ts`），任何按文档 `import '@riseaicloud/ui/styles.css'` 的消费方都会失败。样式本就由消费方
    自己的 Tailwind 生成（preset + content 扫包），文档已同步更正。

### Patch Changes

- c261723: 补上 cockpit / topology 的暗色覆盖 —— 此前暗色下监控面板是白底黑字。

  preset 只在 `:root` 注入 `--cockpit-*` / `--topology-*`，`.dark` 块里没有对应覆盖。这不只是
  "图表配色没跟上"：`cockpitColors.bg` 是 `#F8FAFC`（近白）、`text` 是 `#1E293B`（近黑），
  不覆盖就意味着**整个监控面板在暗色主题下仍是白底黑字**，拓扑图同理。

  新增 `darkCockpitColors` / `darkTopologyColors` 并接进 preset 的 `.dark`。两类值处理方式不同：

  - **表面 / 文字 / 边框**：随主题反转，对齐 slate 家族与 surface scale 的暗色层次
  - **强调色**：暗色下提亮一档（Tailwind 500 → 400）。暗背景上原色显闷，提亮才有同等视觉权重
  - **muted 变体**：不透明度 `.1` → `.15`，10% 的色在暗底上几乎看不出来
  - **拓扑节点**：暗底上要"发光" —— 亮绿底 + 深绿字，与浅色 node 的（中绿底 + 深绿字）同构；
    cluster 从深灰提到 slate-600，否则与暗背景糊在一起

- 02fb90b: 声明 `sideEffects: false`，让消费方的打包器能摇掉未用到的组件。

  两个包都是纯 re-export、无 CSS import、无全局副作用，符合标记条件。没有这个声明时打包器只能
  保守假设 import 整个包会产生副作用，于是把 `@monaco-editor/react`（仅 `YamlEditDialog` 用）、
  `recharts`、`react-day-picker` 等重依赖一并拉进 bundle。

  ⚠️ 对已经 barrel import 全部组件的消费方（如 rise-global 的 `ModuleNavContext` 要把整个组件面
  注入给远程插件）**没有改善** —— 那里 `YamlEditDialog` 确实被用到，monaco 本来就得进 bundle。
  真要按组件切分，需要 per-component entry + `splitting: true`，那会改变产物结构，另议。

- 17842af: 修 `exports` / `main` / `module` 的扩展名错配 —— ESM 消费方此前必崩，CJS 消费方靠 Node 22 的
  宽容行为侥幸能用。

  本包是 `"type": "module"`，tsup 因此产出 `.js`(ESM) + `.cjs`(CJS)。但 `exports` 写的是
  `import → .mjs`（**文件根本不存在**）、`require → .js`（**指向 ESM**）—— 扩展名规则整个反了，
  是照抄 `@riseaicloud/ui` 的（那个包没有 `type: module`，产物恰好是 `.js`=CJS / `.mjs`=ESM）。

  后果：

  - **ESM 消费方**：`import '@riseaicloud/tokens'` 解析到不存在的 `.mjs`，直接失败
  - **CJS 消费方**：`require()` 拿到 ESM 文件。Node 22+ 允许 require ESM 并返回命名空间，所以
    "看起来能用"；Node 18/20 会抛 `ERR_REQUIRE_ESM`

  同时修正文档：`installation.mdx` 教的 `const edgePreset = require('…/tailwind-preset')` 少了
  `.default`。本包是 ESM，CJS require 拿到的是命名空间对象，preset 在 `.default` 上；直接把命名
  空间丢给 `presets`，Tailwind 读 `preset.theme` 得到 `undefined` —— **preset 被静默忽略，没有任何
  报错**，表现为"语义色和 `.dark` 全部消失"。edge-desgin 自己的 `packages/ui/tailwind.config.js`
  早就在做 `.default ?? presetModule`，文档漏了这一步。
