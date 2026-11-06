import FormSection from '@/components/common/FormSection'
import type { FormQuestion, FormSection as Section } from '@/types'
import ChoiceField from './ChoiceField'

interface QuestionSectionProps {
  section: Section
  questions: FormQuestion[]
}

export default function QuestionSection({ section, questions }: QuestionSectionProps) {
  return (
    <FormSection title={section.title} lead={section.lead}>
      {questions
        .filter((q) => q.section === section.id)
        .map((q) => (
          <ChoiceField key={q.id} name={['answers', q.id]} label={q.text} options={q.options} />
        ))}
    </FormSection>
  )
}
