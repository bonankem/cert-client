import {
  CalendarOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { Alert, App, Button, Card, DatePicker, Form, Input, Tag, Typography } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { errorMessage } from '@/api'
import CertificateViewer from '@/components/certificate/CertificateViewer'
import { CERTIFICATE_DESIGNS } from '@/config/constants'
import { useSaveSettings } from '@/hooks/queries/admin'
import type { CertificateDesign, CertificateRecord, CertificateSettings, CertificateSettingsView } from '@/types'
import { formatDateTime } from '@/utils/date'
import { cleanName } from '@/utils/text'
import SignatureUpload from './SignatureUpload'

interface CertificateSettingsFormProps {
  settings: CertificateSettingsView
}

const normalize = (values: Partial<CertificateSettings>): CertificateSettings => ({
  trainerName: cleanName(values.trainerName),
  startDate: values.startDate ?? '',
  endDate: values.endDate ?? '',
  signature: values.signature ?? '',
  designVariant: values.designVariant === 'modern' ? 'modern' : 'classic',
})

const toPickerValue = (value?: string) => (value ? dayjs(value) : null)
const fromPickerValue = (value: Dayjs | null) => value?.format('YYYY-MM-DD') ?? ''

const SAMPLE_RECORD: CertificateRecord = {
  name: 'Participant Name',
  opco: 'MTN Cameroon',
  certId: 'ZC-STN-261105-VZPY',
  submittedAt: new Date().toISOString(),
  verificationCode: 'C7AA-811B-97BO',
}

export default function CertificateSettingsForm({ settings }: CertificateSettingsFormProps) {
  const [form] = Form.useForm<CertificateSettings>()
  const { message } = App.useApp()
  const save = useSaveSettings()

  const [activeVariant, setActiveVariant] = useState<CertificateDesign>(settings.designVariant || 'classic')

  // Load server values unless the admin is mid-edit.
  useEffect(() => {
    if (!form.isFieldsTouched()) {
      const norm = normalize(settings)
      form.setFieldsValue(norm)
      setActiveVariant(norm.designVariant || 'classic')
    }
  }, [form, settings])

  const handleSelectDesign = (design: CertificateDesign) => {
    setActiveVariant(design)
    form.setFieldValue('designVariant', design)
  }

  const handleSave = (values: CertificateSettings) => {
    const payload = normalize({ ...values, designVariant: activeVariant })
    save.mutate(payload, {
      onSuccess: (saved) => {
        form.resetFields()
        const norm = normalize(saved)
        form.setFieldsValue(norm)
        setActiveVariant(norm.designVariant || 'classic')
        message.success('Certificate template and training details saved successfully!')
      },
      onError: (error) => message.error(errorMessage(error)),
    })
  }

  // Watch form fields to provide live updates to the certificate preview
  const watchedTrainerName = Form.useWatch('trainerName', form) ?? settings.trainerName
  const watchedStartDate = Form.useWatch('startDate', form) ?? settings.startDate
  const watchedEndDate = Form.useWatch('endDate', form) ?? settings.endDate
  const watchedSignature = Form.useWatch('signature', form) ?? settings.signature

  const liveSettings: CertificateSettings = {
    trainerName: watchedTrainerName,
    startDate: watchedStartDate,
    endDate: watchedEndDate,
    signature: watchedSignature,
    designVariant: activeVariant,
  }

  const currentTemplateMeta =
    CERTIFICATE_DESIGNS.find((d) => d.id === activeVariant) ?? CERTIFICATE_DESIGNS[0]

  return (
    <div className="flex flex-col gap-5 w-full min-w-0">
      {/* 1. TOP SECTION: Contracted Template Selector + Immediate Live Preview */}
      <Card
        className="w-full min-w-0 overflow-hidden shadow-xs border border-slate-200 dark:border-zinc-800"
        styles={{ body: { padding: '14px 16px' } }}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <EyeOutlined className="text-[#0072ce] text-base" />
            <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-zinc-100">
              Certificate Template Selection & Live Preview
            </span>
          </div>
          <Tag color={activeVariant === 'modern' ? 'blue' : 'cyan'} className="py-0.5 px-2 text-xs font-semibold">
            Active: {currentTemplateMeta.name}
          </Tag>
        </div>

        {/* Contracted, compact selection cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5">
          {CERTIFICATE_DESIGNS.map((design) => {
            const isSelected = activeVariant === design.id
            const isClassic = design.id === 'classic'

            return (
              <div
                key={design.id}
                onClick={() => handleSelectDesign(design.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectDesign(design.id)
                }}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition-all border-2 select-none ${
                  isSelected
                    ? 'border-[#0072ce] bg-blue-50/70 shadow-xs dark:border-[#00a9e8] dark:bg-blue-950/30'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`grid size-7 sm:size-8 shrink-0 place-items-center rounded-lg text-sm sm:text-base transition-colors ${
                      isSelected
                        ? 'bg-[#0072ce] text-white'
                        : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {isClassic ? <SafetyCertificateOutlined /> : <ThunderboltOutlined />}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                        {design.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 truncate block">
                      {isClassic ? 'Official security seal border' : 'Contemporary wave geometry'}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isSelected ? (
                    <span className="text-[#0072ce] dark:text-[#00a9e8] text-base">
                      <CheckCircleFilled />
                    </span>
                  ) : (
                    <span className="size-4.5 rounded-full border border-slate-300 dark:border-zinc-600 block" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Immediate Certificate Live Preview Right Below Selection Cards */}
        <div className="w-full min-w-0 rounded-lg overflow-hidden border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900/50 p-2 sm:p-3">
          <CertificateViewer
            record={SAMPLE_RECORD}
            settings={liveSettings}
            designOverride={activeVariant}
          />
        </div>
      </Card>

      {/* 2. BOTTOM SECTION: Training Details, Trainer Name, Dates & Signature */}
      <Card
        className="w-full min-w-0 overflow-hidden shadow-xs border border-slate-200 dark:border-zinc-800"
        styles={{ body: { padding: 0 } }}
      >
        <div className="bg-gradient-to-r from-[#0b2a5b] to-[#0072ce] px-4 sm:px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/15 text-lg">
              <CalendarOutlined />
            </span>
            <div>
              <div className="font-bold text-sm sm:text-base text-white">
                Training Information & Trainer Credentials
              </div>
              <div className="text-xs text-blue-100/80 mt-0.5">
                Printed on every participant’s certificate upon feedback submission.
              </div>
            </div>
          </div>
        </div>

        <Form<CertificateSettings>
          form={form}
          layout="vertical"
          initialValues={normalize(settings)}
          onFinish={handleSave}
          className="p-4 sm:p-6"
        >
          <Form.Item name="designVariant" className="hidden">
            <Input type="hidden" />
          </Form.Item>

          <div className="grid gap-x-5 gap-y-1 sm:grid-cols-2">
            {settings.legacyDates && !settings.startDate && !settings.endDate && (
              <Alert
                type="info"
                showIcon
                className="mb-4 sm:col-span-2 text-xs"
                message="Existing training dates are preserved"
                description={`Current date string: “${settings.legacyDates}”. Select start and end dates below to replace it.`}
              />
            )}

            <Form.Item
              name="trainerName"
              label="Trainer’s full name"
              tooltip="Printed below the trainer signature."
              className="sm:col-span-2"
            >
              <Input
                size="middle"
                autoComplete="name"
                placeholder="Trainer name (e.g. Engr. John Doe)"
                maxLength={120}
              />
            </Form.Item>

            <Form.Item
              name="startDate"
              label="Training start date"
              getValueProps={(value: string) => ({ value: toPickerValue(value) })}
              getValueFromEvent={fromPickerValue}
              dependencies={['endDate']}
            >
              <DatePicker
                size="middle"
                className="w-full"
                format="D MMMM YYYY"
                placeholder="Select start date"
                disabledDate={(date) => {
                  const endDate = form.getFieldValue('endDate')
                  return !!endDate && date.isAfter(dayjs(endDate), 'day')
                }}
              />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Training end date"
              getValueProps={(value: string) => ({ value: toPickerValue(value) })}
              getValueFromEvent={fromPickerValue}
              dependencies={['startDate']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value: string) {
                    const startDate = getFieldValue('startDate')
                    if (!startDate || !value || value >= startDate) return Promise.resolve()
                    return Promise.reject(new Error('End date must be on or after start date.'))
                  },
                }),
              ]}
            >
              <DatePicker
                size="middle"
                className="w-full"
                format="D MMMM YYYY"
                placeholder="Select end date"
                disabledDate={(date) => {
                  const startDate = form.getFieldValue('startDate')
                  return !!startDate && date.isBefore(dayjs(startDate), 'day')
                }}
              />
            </Form.Item>

            <Form.Item
              name="signature"
              label="Trainer signature image"
              tooltip="Official digital transparent signature"
              className="sm:col-span-2"
            >
              <SignatureUpload />
            </Form.Item>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-zinc-800 pt-4 mt-2">
            {settings.updatedAt ? (
              <Typography.Text type="secondary" className="text-xs">
                <CheckCircleOutlined className="mr-1.5 text-emerald-500" />
                Last saved {formatDateTime(settings.updatedAt)}
              </Typography.Text>
            ) : (
              <span />
            )}
            <Button
              type="primary"
              htmlType="submit"
              loading={save.isPending}
              className="bg-[#0072ce] hover:bg-[#005ea8]"
            >
              Save Active Template & Details
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
