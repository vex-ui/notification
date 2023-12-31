import { inject, type Ref } from 'vue'
import type { NotificationPluginOptions } from '@/plugin'
import type { NotificationItem } from '@/composables/use-notification'

export interface NotificationContext<T extends Record<string, any>>
  extends Required<NotificationPluginOptions> {
  notifications: Ref<NotificationItem<T>[]>
}

export const DEFAULT_NOTIFICATION_CONTEXT_ID = 'vex-notification-context-default-id'

export function useContext<T extends Record<string, any>>(id?: string | symbol) {
  const ctx = inject<NotificationContext<T> | null>(id ?? DEFAULT_NOTIFICATION_CONTEXT_ID, null)
  if (!ctx) {
    throw new Error(
      '[vex] notification context was not found, make sure you have installed the plugin'
    )
  }
  return ctx
}
