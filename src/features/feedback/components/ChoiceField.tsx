import { Form, type FormItemProps } from 'antd'
import ChoiceChips from '@/components/common/ChoiceChips'
import type { ChoiceOption } from '@/types'
import { requiredChoice } from '../validation'

interface ChoiceFieldProps {
  name: FormItemProps['name']
  label: string
  options: readonly (string | ChoiceOption)[]
  requiredMessage?: string
}

/** A required single-choice question rendered as chips. */
export default function ChoiceField({ name, label, options, requiredMessage }: ChoiceFieldProps) {
  return (
    <Form.Item name={name} label={label} rules={requiredChoice(requiredMessage)}>
      <ChoiceChips options={options} />
    </Form.Item>
  )
}
