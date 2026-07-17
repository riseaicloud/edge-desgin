---
"@riseaicloud/ui": patch
---

修 Dialog 遮罩在浅色下等于没有遮罩；让 `"use client"` 真正进入产物。

- **`dialog.tsx` 的遮罩 `bg-background/80` → `bg-black/80`**。`bg-background/80` 在浅色下算出来是
  `hsl(0 0% 100% / .8)` —— 白色半透明，等于没遮罩。遮罩的语义是「压暗背景」，不该跟随
  `--background` 反转。改后与 `alert-dialog` / `sheet` 一致（也是 shadcn 的基准），三个 overlay
  组件终于统一。**这是可见的视觉修复**：浅色下弹窗背后会真正变暗。
- **`"use client"` 现在会写进 `dist/index.mjs` / `dist/index.js`**。源码里 30 个组件写了指令，但打包
  会丢弃模块级指令 —— 产物里一个都不剩，那 30 个指令一直是失效的。库里几乎每个组件都用
  hooks 或 Radix，在 RSC 下 import 会直接报错；此前没暴露只是因为消费方页面本身都是 client。
  注意不能用 tsup 的 `banner`：`treeshake: true` 让 rollup 接手后处理，而 rollup 明确忽略模块级
  指令，故改为构建后置写回。
