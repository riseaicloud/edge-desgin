---
"@riseaicloud/ui": minor
"@riseaicloud/tokens": minor
---

Tailwind 升 3.4 + 新增 Breadcrumb 与 Field 家族。tokens 的 tailwindcss peerDependency 从 >=3.3.0 提到 >=3.4.0（消费方需同步升级，否则新组件的 has-[]/size-* 类静默不生成）。Breadcrumb 为 shadcn 原版（nav 语义 + aria，深色 chrome 用 className 覆盖配色）。Field 家族（Field/FieldLabel/FieldContent/FieldDescription/FieldTitle/FieldError/FieldGroup/FieldSet/FieldLegend/FieldSeparator）为 shadcn 2025 秋新增表单布局原语的 v4→v3.4 降级适配版：has-data-[] 改写 has-[[...]]、nth-last-2 改写 arbitrary variant、容器查询移除（orientation="responsive" 降级为 vertical）。分工纪律：Field* = 布局层，Form* = 校验绑定层，可嵌套勿混用。
