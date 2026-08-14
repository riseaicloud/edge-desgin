---
"@riseaicloud/ui": patch
---

RadioGroup 换回 shadcn/Radix 原版实现，修复手搓版的一串交互缺陷：方向键不能在选项间移动（radio 未设 name 不成组）、键盘焦点不可见（焦点落在 sr-only input 上）、点击视觉圆圈在未传 ref 时 TypeError、group 级 disabled 不生效。对外 API（RadioGroup/RadioGroupItem，value/onValueChange/defaultValue）不变，消费方无痛升级。附带修 Storybook Controlled story 缺 React import 导致的运行时崩溃。
