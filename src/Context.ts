import { inject, type Ref } from 'vue'
import type { ToastPluginOptions } from '@/plugin'
import type { ToastItem } from '@/composables/use-toast'

export interface ToastServiceContext<T extends Record<string, any>>
  extends Required<ToastPluginOptions> {
  toasts: Ref<ToastItem<T>[]>
}

export const DEFAULT_TOAST_SERVICE_ID = 'vex-toast-service-default-id'

export function useContext<T extends Record<string, any>>(id?: string | symbol) {
  const ctx = inject<ToastServiceContext<T> | null>(id ?? DEFAULT_TOAST_SERVICE_ID, null)
  if (!ctx) {
    throw new Error(
      '[vex] toast service context was not found, make sure you have installed the plugin'
    )
  }
  return ctx
}
