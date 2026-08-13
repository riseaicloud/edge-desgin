/**
 * useSelectOptions —— `Select`（@riseaicloud/ui）远程数据的**平台唯一翻页状态机**。
 *
 * 没有它，每个页面都要手写一遍「累积 options + 翻页 + 搜索重置 + 竞态丢弃」——
 * 这正是散装下拉时代的增熵源。约定收口在三处：
 *
 *   组件层：Select 只认 options/loading/hasMore/onLoadMore/onSearch（零后端知识）
 *   本 hook：状态机唯一实现（页面一行接入：`{...xxx.selectProps}`）
 *   fetcher：参数字典（下表），两种后端形状自动识别 ——
 *
 *     常规 BFF：req { page(1起), pageSize, keyword } → res { items, total }
 *               hasMore = page*pageSize < total
 *     K8s 风格：req { limit=pageSize, continue=cursor, keyword } → res { items, continue }
 *               hasMore = continue 非空（响应带 continue 字段即自动走此模式）
 *
 * 边界纪律：本 hook **不带 http client、不带 URL**——收 fetcher 函数，数据从哪来
 * 是调用方（页面/业务选择器）的事。
 */
import { useCallback, useRef, useState } from 'react'

export interface SelectOptionsPage {
  /** 页码模式：1 起。游标模式下仍递增，仅供调试。 */
  page: number
  pageSize: number
  /** 搜索关键词（Select 内部已防抖）。 */
  query: string
  /** 游标模式：上一页响应的 continue；第一页为 undefined。 */
  cursor?: string
}

export interface SelectOptionsResult<T> {
  items: T[]
  /** 页码模式：总条数。 */
  total?: number
  /** 游标模式：下一页游标；空/缺省 = 没有更多。 */
  continue?: string
}

export interface UseSelectOptionsReturn<T> {
  /** 直接展开给 <Select {...selectProps} />。 */
  selectProps: {
    options: T[]
    loading: boolean
    hasMore: boolean
    onSearch: (query: string) => void
    onLoadMore: () => void
    onOpen: () => void
  }
  /** 手动重置并重拉第一页（比如外部筛选条件变化时）。 */
  reload: () => void
  error: unknown
}

export function useSelectOptions<T extends { value: string; label: string }>(
  fetcher: (p: SelectOptionsPage) => Promise<SelectOptionsResult<T>>,
  { pageSize = 20 }: { pageSize?: number } = {}
): UseSelectOptionsReturn<T> {
  const [options, setOptions] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<unknown>(null)

  // 全部可变状态收进 ref：回调要在闭包外读到最新值，且不因状态变化换引用
  const stateRef = useRef({
    page: 0,
    cursor: undefined as string | undefined,
    query: '',
    requestSeq: 0, // 竞态闸门：只认最后一次发出的请求
    opened: false,
  })

  const load = useCallback(
    async (reset: boolean) => {
      const s = stateRef.current
      const seq = ++s.requestSeq
      const page = reset ? 1 : s.page + 1
      const cursor = reset ? undefined : s.cursor

      setLoading(true)
      setError(null)
      try {
        const res = await fetcher({ page, pageSize, query: s.query, cursor })
        if (seq !== s.requestSeq) return // 过期响应，丢弃（快速改搜索词/连滚时的竞态）

        s.page = page
        s.cursor = res.continue
        setOptions((prev) => (reset ? res.items : [...prev, ...res.items]))
        // 游标模式（响应带 continue 字段）优先；否则按 total 推导
        if ('continue' in res) {
          setHasMore(!!res.continue)
        } else if (typeof res.total === 'number') {
          setHasMore(page * pageSize < res.total)
        } else {
          // 两者都没给：按"取满一页可能还有"兜底
          setHasMore(res.items.length >= pageSize)
        }
      } catch (e) {
        if (seq === s.requestSeq) setError(e)
      } finally {
        if (seq === s.requestSeq) setLoading(false)
      }
    },
    [fetcher, pageSize]
  )

  const onSearch = useCallback(
    (query: string) => {
      stateRef.current.query = query
      void load(true) // 搜索词变化 → 重置回第一页
    },
    [load]
  )

  const onLoadMore = useCallback(() => void load(false), [load])

  const onOpen = useCallback(() => {
    // 首次打开才拉数据（懒加载）；之后打开不重复拉，交给 reload/onSearch
    if (!stateRef.current.opened) {
      stateRef.current.opened = true
      void load(true)
    }
  }, [load])

  const reload = useCallback(() => {
    stateRef.current.opened = true
    void load(true)
  }, [load])

  return {
    selectProps: { options, loading, hasMore, onSearch, onLoadMore, onOpen },
    reload,
    error,
  }
}
