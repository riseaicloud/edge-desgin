---
"@riseaicloud/ui": minor
---

新增 SegmentedControl——radio 语义的按钮化外观（对齐 el-radio-button 的生态位，shadcn 无此组件）。Radix RadioGroup 底座（必选不可取消、方向键、name 表单集成），options 数组门面式 API，四个 variant：pill（灰底容器+实心胶囊）/ solid（连体实心）/ outline（连体描边）/ chips（独立描边按钮+淡底，可换行），选中态一律 primary 配对、跟随主题。全部遵守偏好约束：var 圆角、primary 配对、暗色自动反转。判据入 index：值要提交 → RadioGroup/SegmentedControl；纯切视图 → Tabs；允许全不选 → ToggleGroup。
