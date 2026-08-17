---
"@riseaicloud/ui": minor
---

新增 UsageMeter——资源用量行组合封装（标签 + 迷你进度条 + 百分比 + Tooltip 悬停明细，CAMP 资源池 vGPU/算力/显存列表同款）。Progress + Tooltip 底座；tone：primary（默认跟主题）/success/warning/danger 固定档 + auto 水位语义档（<70 绿、70–90 黄、≥90 红，固定色相同 StatusIndicator 规范）；details 数组渲染「- label value」明细行（也收 ReactNode）；color 收任意 CSS 颜色（运行时动态色经 CSS 变量注入，类名保持静态可被 Tailwind 扫描）；showPercent/barClassName/labelClassName 微调。
