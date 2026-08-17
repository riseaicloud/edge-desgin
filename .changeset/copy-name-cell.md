---
"@riseaicloud/ui": minor
---

新增 CopyButton 与 ResourceNameCell。CopyButton：一键复制 + ✓ 反馈 1.5s，含 HTTP 非安全上下文的 execCommand 兜底（平台 NodePort 直连面 navigator.clipboard 不存在，与 SDK generateUUID 同坑），stopPropagation 不触发表格整行点击。ResourceNameCell：表格「名称 + ID + 复制」首列单元格（可选图标、ID 截断 + title 悬停全文）；详情跳转默认通道 = onIdClick（点 ID 进详情的 CAMP 惯例，ID 渲染为链接样式），onNameClick 为备用通道；别名拼装等业务规则归消费方。
