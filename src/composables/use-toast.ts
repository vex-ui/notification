import { readonly, shallowRef } from 'vue'
import { useID } from './use-id'

export function useToast<T extends Record<string, any>>(options: UseToastOptions = {}) {
  const { newToastsPosition = 'end' } = options
  const toasts = shallowRef<ToastItem<T>[]>([])

  const toastify = (content: T, options: ToastifyOptions): ToastifyReturn => {
    const toastId = useID()
    const toast: ToastItem<T> = { id: toastId, ...options, content }
    toasts.value = newToastsPosition === 'end' ? [...toasts.value, toast] : [toast, ...toasts.value]
    return {
      id: toastId,
    }
  }

  const dismiss = (id: string) => {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }

  const dismissAll = () => {
    toasts.value = []
  }

  return {
    toastify,
    dismiss,
    dismissAll,
    toasts: readonly(toasts),
  }
}

export interface UseToastOptions {
  newToastsPosition?: 'start' | 'end'
}

export interface ToastifyOptions {
  persist?: boolean
  duration: number
  closable?: boolean
}

export interface ToastifyReturn {
  id: string
}

export interface ToastItem<T extends Record<string, any> = Record<string, any>>
  extends ToastifyOptions {
  id: string
  content: T
}
