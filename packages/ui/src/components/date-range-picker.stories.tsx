import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DateRangePicker, type DateRange } from './date-range-picker'

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

function Demo(props: Partial<React.ComponentProps<typeof DateRangePicker>>) {
  const now = Date.now()
  const [range, setRange] = useState<DateRange>({ start: now - 7 * 864e5, end: now })
  return <DateRangePicker value={range} onChange={setRange} {...props} />
}

export const Default: Story = {
  render: () => <Demo />,
}

export const WithLabel: Story = {
  render: () => <Demo label="时间范围" />,
}

export const DateOnly: Story = {
  render: () => <Demo showTime={false} />,
}

export const ClampedToSevenDays: Story = {
  render: () => <Demo label="最多 7 天" maxDays={7} />,
}
