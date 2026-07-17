---
"@riseaicloud/tokens": patch
---

补上 cockpit / topology 的暗色覆盖 —— 此前暗色下监控面板是白底黑字。

preset 只在 `:root` 注入 `--cockpit-*` / `--topology-*`，`.dark` 块里没有对应覆盖。这不只是
"图表配色没跟上"：`cockpitColors.bg` 是 `#F8FAFC`（近白）、`text` 是 `#1E293B`（近黑），
不覆盖就意味着**整个监控面板在暗色主题下仍是白底黑字**，拓扑图同理。

新增 `darkCockpitColors` / `darkTopologyColors` 并接进 preset 的 `.dark`。两类值处理方式不同：
- **表面 / 文字 / 边框**：随主题反转，对齐 slate 家族与 surface scale 的暗色层次
- **强调色**：暗色下提亮一档（Tailwind 500 → 400）。暗背景上原色显闷，提亮才有同等视觉权重
- **muted 变体**：不透明度 `.1` → `.15`，10% 的色在暗底上几乎看不出来
- **拓扑节点**：暗底上要"发光" —— 亮绿底 + 深绿字，与浅色 node 的（中绿底 + 深绿字）同构；
  cluster 从深灰提到 slate-600，否则与暗背景糊在一起
