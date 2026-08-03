---
"@riseaicloud/tokens": minor
---

新增 `--font-size-base` 正文基准字号 token

与 `--radius` 同性质的可覆盖杠杆：消费方在 `:root` 或 `<html>` 上改一个值，正文字号跟随，
用于支撑"字号偏好"这类用户可调项。preset 在 `:root` 注入默认值并在 base 层作用到 `body`。

刻意只作用 `body`、不动根 `font-size` —— Tailwind 的间距与字号刻度全是 rem，动根字号会把
整套布局一起缩放。组件自身的 `text-xs` / `text-sm` 是绝对 rem 值，不受影响。

默认 `16px` = `fontSize.base`(1rem) = 浏览器默认，所以现有消费方视觉零变化。
同时导出 `fontSizeBase` 常量。

另修 preset 里 `--radius` 硬写字面量 `'0.5rem'` 的问题 —— `radiusBase` 常量早已存在但没被
引用，改 token 会漏掉注入点。现改为引用常量。
