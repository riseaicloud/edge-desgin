---
"@riseaicloud/tokens": patch
---

修 `exports` / `main` / `module` 的扩展名错配 —— ESM 消费方此前必崩，CJS 消费方靠 Node 22 的
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
