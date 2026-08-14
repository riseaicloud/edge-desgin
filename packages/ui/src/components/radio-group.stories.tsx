import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup, RadioGroupItem } from './radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="r1" />
        <label htmlFor="r1" className="text-sm">Option 1</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="r2" />
        <label htmlFor="r2" className="text-sm">Option 2</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="r3" />
        <label htmlFor="r3" className="text-sm">Option 3</label>
      </div>
    </RadioGroup>
  ),
}

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState('option1')
    return (
      <div className="space-y-2">
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="c1" />
            <label htmlFor="c1" className="text-sm">Option 1</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="c2" />
            <label htmlFor="c2" className="text-sm">Option 2</label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">Selected: {value}</p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" disabled>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="d1" />
        <label htmlFor="d1" className="text-sm opacity-50">Option 1</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="d2" />
        <label htmlFor="d2" className="text-sm opacity-50">Option 2</label>
      </div>
    </RadioGroup>
  ),
}
