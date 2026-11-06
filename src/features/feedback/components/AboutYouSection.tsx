import { Form, Input, Select } from 'antd'
import FormSection from '@/components/common/FormSection'
import { fullNameRules } from '../validation'

export default function AboutYouSection({ opcos }: { opcos: string[] }) {
  return (
    <FormSection title="About you" lead="Your name will appear on your certificate exactly as you type it.">
      <Form.Item name="fullName" label="Full name" rules={fullNameRules} validateTrigger="onBlur">
        <Input size="small" autoComplete="name" placeholder="First name and surname" maxLength={120} />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email address"
        extra="We’ll email your certificate here once it’s approved. One certificate per email: use the same address to update your details later."
        validateTrigger="onBlur"
        rules={[
          { required: true, message: 'Enter your email address.' },
          { type: 'email', message: 'Enter a valid email address.' },
        ]}
      >
        <Input size="small" type="email" autoComplete="email" inputMode="email" placeholder="name@example.com" maxLength={254} />
      </Form.Item>
      <Form.Item name="opco" label="MTN OpCo">
        <Select size="small" options={opcos.map((opco) => ({ label: opco, value: opco }))} />
      </Form.Item>
    </FormSection>
  )
}
