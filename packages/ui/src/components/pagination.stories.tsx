import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Pagination } from './pagination'

const meta: Meta<typeof Pagination> = {
  title: '二次封装/Pagination',
  parameters: { componentSubtitle: '自研（数据分页条，非 shadcn 链接式页码） · 原生' },
  component: Pagination,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  render: function PaginationStory() {
    const [page, setPage] = React.useState(1)
    const [size, setSize] = React.useState(10)
    return (
      <div className="w-[560px]">
        <Pagination
          currentPage={page}
          pageSize={size}
          totalItems={53}
          onPageChange={setPage}
          onPageSizeChange={setSize}
        />
      </div>
    )
  },
}
