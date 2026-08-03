import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>Edge Design</span>,
  project: {
    link: 'https://github.com/riseaicloud/edge-desgin',
  },
  // 设计系统早期住在 theriseunion/edge-platform 的 design/ 目录下，独立成仓后这个路径没跟着改，
  // 导致每页的「Edit this page」都指向一个不存在的位置。
  docsRepositoryBase: 'https://github.com/riseaicloud/edge-desgin/tree/main/docs',
  footer: {
    text: 'Edge Design System',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="font-semibold">{title}</span>
      }
      return <>{title}</>
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Edge Platform Design System" />
    </>
  ),
}

export default config
