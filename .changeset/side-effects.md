---
"@riseaicloud/tokens": patch
"@riseaicloud/ui": patch
---

声明 `sideEffects: false`，让消费方的打包器能摇掉未用到的组件。

两个包都是纯 re-export、无 CSS import、无全局副作用，符合标记条件。没有这个声明时打包器只能
保守假设 import 整个包会产生副作用，于是把 `@monaco-editor/react`（仅 `YamlEditDialog` 用）、
`recharts`、`react-day-picker` 等重依赖一并拉进 bundle。

⚠️ 对已经 barrel import 全部组件的消费方（如 rise-global 的 `ModuleNavContext` 要把整个组件面
注入给远程插件）**没有改善** —— 那里 `YamlEditDialog` 确实被用到，monaco 本来就得进 bundle。
真要按组件切分，需要 per-component entry + `splitting: true`，那会改变产物结构，另议。
