// This is a simplified implementation - you might want to install the full shadcn/ui toast implementation
import { useState, useCallback } from 'react'
import { Toast, ToastProps } from './toast'

type ToastOptions = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
      duration = 5000,
    }: ToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastProps = {
        id,
        title,
        description,
        variant,
      }

      setToasts((prevToasts) => [...prevToasts, newToast])

      // Auto dismiss
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
      }, duration)

      return id
    },
    [],
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return { toast, dismiss, toasts }
}
