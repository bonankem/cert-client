import FormSection from '@/components/common/FormSection'
import type { FormConfig } from '@/types'
import ChoiceField from './ChoiceField'

export default function ConsentSection({ consent }: { consent: FormConfig['consent'] }) {
  return (
    <FormSection title="Success story">
      <p className="mb-3 rounded-xl bg-black/4 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed opacity-85 dark:bg-white/6">
        {consent.disclaimer}
      </p>
      <ChoiceField
        name="consent"
        label={consent.question}
        options={consent.options}
        requiredMessage="Choose yes or no."
      />
    </FormSection>
  )
}
