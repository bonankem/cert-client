import type { FormRule } from 'antd'
import { isFullName } from '@/utils/text'

export const fullNameRules: FormRule[] = [
  {
    validator: (_, value?: string) =>
      isFullName(value) ? Promise.resolve() : Promise.reject(new Error('Enter your first name and surname.')),
  },
]

export const requiredChoice = (message = 'Choose an answer.'): FormRule[] => [{ required: true, message }]
