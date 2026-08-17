---
"@riseaicloud/ui": minor
---

新增 CodeEditor——内嵌式代码编辑器（表单字段级），对齐 CAMP lumi-code-mirror-ide 生态位（启动命令/脚本/JSON/YAML 片段）。monaco 底座（不引第二个编辑器引擎），React.lazy 按需加载不进 barrel；API：value/onChange/language/readOnly/height/theme(dark|light)/placeholder（覆盖层实现）。与 YamlEditDialog 分工：字段级中性组件 vs 全屏弹窗组合封装。rise-global 现存 4 处散装 monaco 内嵌为收敛目标。
