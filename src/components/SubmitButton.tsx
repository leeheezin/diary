'use client'
import { useFormStatus } from 'react-dom'

export default function SubmitButton({ name }: { name: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}>
      {pending ? 'loading...' : name}
    </button>
  )
}