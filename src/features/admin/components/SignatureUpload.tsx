import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { App, Button, Flex, Upload } from 'antd'
import { prepareSignatureImage } from '@/utils/image'

interface SignatureUploadProps {
  /** PNG data URL ('' when empty). Injected by Form.Item. */
  value?: string
  onChange?: (value: string) => void
}

export default function SignatureUpload({ value, onChange }: SignatureUploadProps) {
  const { message } = App.useApp()

  const beforeUpload = (file: File) => {
    prepareSignatureImage(file)
      .then((dataUrl) => onChange?.(dataUrl))
      .catch(() => message.error('Couldn’t read that image. Try a PNG or JPG.'))
    return false // handled locally; never upload
  }

  return (
    <Flex gap={12} align="center" wrap>
      {value && (
        <img src={value} alt="Your signature" className="max-h-17.5 rounded-lg border border-black/10 bg-white p-1" />
      )}
      <Upload accept="image/png,image/jpeg,image/webp" showUploadList={false} beforeUpload={beforeUpload}>
        <Button icon={<UploadOutlined />}>{value ? 'Replace signature' : 'Upload signature'}</Button>
      </Upload>
      {value && (
        <Button danger icon={<DeleteOutlined />} onClick={() => onChange?.('')}>
          Remove signature
        </Button>
      )}
    </Flex>
  )
}
