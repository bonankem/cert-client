import { Spin } from 'antd'

export default function PageSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spin size="large" />
    </div>
  )
}
