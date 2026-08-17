import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from './field'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Checkbox } from './checkbox'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof Field> = {
  title: 'Shadcn 原生/Field',
  parameters: { componentSubtitle: 'shadcn 适配（TW v4→v3.4 降级） · 原生 + Label' },
  component: Field,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Field>

/** 基础用法：label + 输入框 + 描述 */
export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Field>
        <FieldLabel htmlFor="username">用户名</FieldLabel>
        <Input id="username" placeholder="rise-user" />
        <FieldDescription>3–63 个字符，小写字母、数字与连字符。</FieldDescription>
      </Field>
    </div>
  ),
}

/** 单选项带描述（对应 shadcn 文档 Radio Group + Field 示例） */
export const RadioWithDescription: Story = {
  render: function RadioStory() {
    const [value, setValue] = React.useState('comfortable')
    return (
      <div className="w-96">
        <FieldSet>
          <FieldLegend>界面密度</FieldLegend>
          <RadioGroup value={value} onValueChange={setValue}>
            <Field orientation="horizontal">
              <RadioGroupItem value="default" id="density-default" />
              <FieldContent>
                <FieldLabel htmlFor="density-default">Default</FieldLabel>
                <FieldDescription>Standard spacing for most use cases.</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="comfortable" id="density-comfortable" />
              <FieldContent>
                <FieldLabel htmlFor="density-comfortable">Comfortable</FieldLabel>
                <FieldDescription>More space between elements.</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="compact" id="density-compact" />
              <FieldContent>
                <FieldLabel htmlFor="density-compact">Compact</FieldLabel>
                <FieldDescription>Minimal spacing for dense layouts.</FieldDescription>
              </FieldContent>
            </Field>
          </RadioGroup>
        </FieldSet>
      </div>
    )
  },
}

/** Choice Card：FieldLabel 包住整个 Field = 可点击卡片选择（含整卡可点断言） */
export const ChoiceCard: Story = {
  play: async ({ canvasElement }) => {
    const { expect, userEvent, within, waitFor } = await import('@storybook/test')
    const canvas = within(canvasElement)
    // 点卡片文字（非圆点本体）即可切换 —— FieldLabel 包卡的核心价值
    await userEvent.click(canvas.getByText('For growing businesses.'))
    await waitFor(() =>
      expect(canvas.getByRole('radio', { name: /Pro/ })).toHaveAttribute('data-state', 'checked')
    )
  },
  render: function ChoiceCardStory() {
    const [plan, setPlan] = React.useState('plus')
    return (
      <div className="w-96">
        <RadioGroup value={plan} onValueChange={setPlan}>
          <FieldLabel>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Plus</FieldTitle>
                <FieldDescription>For individuals and small teams.</FieldDescription>
              </FieldContent>
              <RadioGroupItem value="plus" />
            </Field>
          </FieldLabel>
          <FieldLabel>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Pro</FieldTitle>
                <FieldDescription>For growing businesses.</FieldDescription>
              </FieldContent>
              <RadioGroupItem value="pro" />
            </Field>
          </FieldLabel>
          <FieldLabel>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Enterprise</FieldTitle>
                <FieldDescription>For large teams and enterprises.</FieldDescription>
              </FieldContent>
              <RadioGroupItem value="enterprise" />
            </Field>
          </FieldLabel>
        </RadioGroup>
      </div>
    )
  },
}

/** Checkbox 选项卡片 */
export const CheckboxCard: Story = {
  render: function CheckboxCardStory() {
    const [checked, setChecked] = React.useState(true)
    return (
      <div className="w-96">
        <FieldLabel>
          <Field orientation="horizontal">
            <Checkbox
              checked={checked}
              onCheckedChange={setChecked}
            />
            <FieldContent>
              <FieldTitle>启用告警通知</FieldTitle>
              <FieldDescription>集群异常时通过钉钉群推送。</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </div>
    )
  },
}

/** 错误态：FieldError 去重展示 */
export const WithError: Story = {
  render: () => (
    <div className="w-96">
      <Field data-invalid="true">
        <FieldLabel htmlFor="quota">配额上限</FieldLabel>
        <Input id="quota" defaultValue="-1" aria-invalid />
        <FieldError errors={[{ message: '必须为正整数' }]} />
      </Field>
    </div>
  ),
}

/** FieldGroup 纵向编组多个 Field */
export const Group: Story = {
  render: () => (
    <div className="w-96">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="g-name">名称</FieldLabel>
          <Input id="g-name" />
        </Field>
        <Field>
          <FieldLabel htmlFor="g-desc">描述</FieldLabel>
          <Input id="g-desc" />
          <FieldDescription>可选。</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  ),
}
