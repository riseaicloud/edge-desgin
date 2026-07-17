---
"@riseaicloud/tokens": minor
"@riseaicloud/ui": minor
---

新增 surface 语义 token（`bg-surface-page` / `-toolbar` / `-section` / `-dialog-header`），
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
  所以线上无恙，但 Storybook 的视觉基线是错的。变量now只从 preset 来。
- **ui**：`pagination.tsx` 的 inline `#F9FBFD` 改为 `bg-surface-toolbar`。
- **ui**：移除 `exports` 里的 `"./styles"` —— 它指向的 `dist/styles.css` 从不存在（tsup entry 只有
  `index.ts`），任何按文档 `import '@riseaicloud/ui/styles.css'` 的消费方都会失败。样式本就由消费方
  自己的 Tailwind 生成（preset + content 扫包），文档已同步更正。
