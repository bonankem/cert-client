import { Radio, type RadioGroupProps } from 'antd'
import type { ChoiceOption } from '@/types'

interface ChoiceChipsProps extends Omit<RadioGroupProps, 'options' | 'optionType'> {
  options: readonly (string | ChoiceOption)[]
}

const toOption = (option: string | ChoiceOption): ChoiceOption =>
  typeof option === 'string' ? { label: option, value: option } : option

/**
 * Pill-shaped single-choice group. Works as a controlled antd Form field
 * (value / onChange are passed through).
 */
export default function ChoiceChips({ options, ...props }: ChoiceChipsProps) {
  return (
    <Radio.Group
      optionType="button"
      buttonStyle="solid"
      className="choice-chips"
      options={options.map(toOption)}
      {...props}
    />
  )
}
