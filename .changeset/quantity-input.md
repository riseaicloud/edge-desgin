---
"@riseaicloud/ui": minor
---

新增 QuantityInput——K8s 资源量输入（左侧上下步进 + 居中数值 + 右侧单位下拉，如 6 Gi / 500 毫核）。组合封装（SelectRoot + 自研步进），输入行为与 NumberField 同约定（编辑不拦、blur/Enter 钳制归一）；units 空/单个时优雅退化（纯步进 / 静态单位文本）；单位换算归消费方，组件只报告 (value, unit)。
