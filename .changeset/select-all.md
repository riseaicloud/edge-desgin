---
"@riseaicloud/ui": minor
---

Select 门面新增 selectAll（仅 multiple 生效，true=默认文案「全选」/string 自定义）。combobox 引擎列表顶部固定全选行（不随滚动走），半选态承载语义诚实：勾选框打勾只出现在全集确实已选（!hasMore 且可见项全选中）；远程分页未加载完时全选后停留半选态 + 旁注「仅全选已加载」；作用域=当前可见列表（含过滤后）排除 disabled，已全选再点只摘掉可见项、过滤外既有选中保留。纯增量，不动 v1.3.0 收口的既有 API。
