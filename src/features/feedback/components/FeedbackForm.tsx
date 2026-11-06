import { Alert, Button, Card, Form, Result, Skeleton, Typography } from 'antd'
import { errorMessage } from '@/api'
import BrandLogo from '@/components/common/BrandLogo'
import { useFormConfig, useSubmitResponse } from '@/hooks/queries/public'
import type { FeedbackFormValues, SubmittedResponse } from '@/types'
import { cleanName } from '@/utils/text'
import AboutYouSection from './AboutYouSection'
import ConsentSection from './ConsentSection'
import QuestionSection from './QuestionSection'

interface FeedbackFormProps {
  onSubmitted: (record: SubmittedResponse) => void
}

function FormFooter({ submitting }: { submitting: boolean }) {
  return (
    <div className="pt-3 sm:pt-4">
      <Button
        type="primary"
        htmlType="submit"
        block
        loading={submitting}
        className="h-10 sm:h-11 text-xs sm:text-sm font-semibold rounded-lg"
      >
        {submitting ? 'Submitting…' : 'Submit and get my certificate'}
      </Button>
      <p className="mt-2.5 sm:mt-3 mb-0 text-center text-xs text-slate-500 dark:text-slate-400">
        Your responses go to the Zoracom training team.
      </p>
      <BrandLogo name="stablenet" className="mx-auto mt-3 sm:mt-4 h-7 sm:h-9" />
    </div>
  )
}

export default function FeedbackForm({ onSubmitted }: FeedbackFormProps) {
  const [form] = Form.useForm<FeedbackFormValues>()
  const config = useFormConfig()
  const submit = useSubmitResponse()

  if (config.isPending) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    )
  }

  if (config.isError) {
    return (
      <Card>
        <Result
          status="warning"
          title="The form couldn’t load"
          subTitle={errorMessage(config.error)}
          extra={<Button onClick={() => config.refetch()}>Try again</Button>}
        />
      </Card>
    )
  }

  const { sections, questions, opcos, defaultOpco, consent } = config.data

  const handleFinish = (values: FeedbackFormValues) =>
    submit.mutate({ ...values, fullName: cleanName(values.fullName) }, { onSuccess: onSubmitted })

  return (
    <Card classNames={{ body: 'px-3! sm:px-5! pt-1! pb-4! sm:pb-5!' }}>
      <Form<FeedbackFormValues>
        form={form}
        layout="vertical"
        size="large"
        requiredMark={false}
        initialValues={{ opco: defaultOpco }}
        scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
        onFinish={handleFinish}
        onValuesChange={() => submit.isError && submit.reset()}
      >
        <AboutYouSection opcos={opcos} />
        {sections.map((section) => (
          <QuestionSection key={section.id} section={section} questions={questions} />
        ))}
        <ConsentSection consent={consent} />

        {submit.isError && (
          <Alert type="error" showIcon className="mt-4" title="Your feedback wasn’t sent" description={errorMessage(submit.error)} />
        )}
        <FormFooter submitting={submit.isPending} />
      </Form>
    </Card>
  )
}
