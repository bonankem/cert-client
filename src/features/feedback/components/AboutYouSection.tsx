import { Form, Input, Select } from 'antd'
import FormSection from '@/components/common/FormSection'
import { fullNameRules } from '../validation'

export default function AboutYouSection({ opcos }: { opcos: string[] }) {
  return (
    <FormSection title="About you" lead="Your name will appear on your certificate exactly as you type it.">
      <Form.Item name="fullName" label="Full name" rules={fullNameRules} validateTrigger="onBlur">
        <Input size="small" autoComplete="name" placeholder="First name and surname" maxLength={120} />
      </Form.Item>
      <Form.Item name="opco" label="MTN OpCo">
        <Select size="small" options={opcos.map((opco) => ({ label: opco, value: opco }))} />
      </Form.Item>
    </FormSection>
  )
}
