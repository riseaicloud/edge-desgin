# @riseaicloud/ui

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

- b6fecae: 修 Dialog 遮罩在浅色下等于没有遮罩；让 `"use client"` 真正进入产物。

  - **`dialog.tsx` 的遮罩 `bg-background/80` → `bg-black/80`**。`bg-background/80` 在浅色下算出来是
    `hsl(0 0% 100% / .8)` —— 白色半透明，等于没遮罩。遮罩的语义是「压暗背景」，不该跟随
    `--background` 反转。改后与 `alert-dialog` / `sheet` 一致（也是 shadcn 的基准），三个 overlay
    组件终于统一。**这是可见的视觉修复**：浅色下弹窗背后会真正变暗。
  - **`"use client"` 现在会写进 `dist/index.mjs` / `dist/index.js`**。源码里 30 个组件写了指令，但打包
    会丢弃模块级指令 —— 产物里一个都不剩，那 30 个指令一直是失效的。库里几乎每个组件都用
    hooks 或 Radix，在 RSC 下 import 会直接报错；此前没暴露只是因为消费方页面本身都是 client。
    注意不能用 tsup 的 `banner`：`treeshake: true` 让 rollup 接手后处理，而 rollup 明确忽略模块级
    指令，故改为构建后置写回。

- 02fb90b: 声明 `sideEffects: false`，让消费方的打包器能摇掉未用到的组件。

  两个包都是纯 re-export、无 CSS import、无全局副作用，符合标记条件。没有这个声明时打包器只能
  保守假设 import 整个包会产生副作用，于是把 `@monaco-editor/react`（仅 `YamlEditDialog` 用）、
  `recharts`、`react-day-picker` 等重依赖一并拉进 bundle。

  ⚠️ 对已经 barrel import 全部组件的消费方（如 rise-global 的 `ModuleNavContext` 要把整个组件面
  注入给远程插件）**没有改善** —— 那里 `YamlEditDialog` 确实被用到，monaco 本来就得进 bundle。
  真要按组件切分，需要 per-component entry + `splitting: true`，那会改变产物结构，另议。

- Updated dependencies [c261723]
- Updated dependencies [02fb90b]
- Updated dependencies [d265b55]
- Updated dependencies [17842af]
  - @riseaicloud/tokens@1.1.0
