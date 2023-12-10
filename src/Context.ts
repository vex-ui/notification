import { inject, type Ref } from 'vue'
import type { PluginOptions, NotificationItem } from '@/plugin'

export interface NotificationContext extends Required<PluginOptions> {
  notifications: Ref<NotificationItem[]>
  uid: string | symbol
}

export const DEFAULT_NOTIFICATION_CONTEXT_UID = 'vex-notification-default-uid'

export function useContext(uid?: string | symbol) {
  const ctx = inject<NotificationContext | null>(uid ?? DEFAULT_NOTIFICATION_CONTEXT_UID, null)
  if (!ctx) {
    throw new Error(
      '[vex] notifications context was not found, make sure you have installed the plugin'
    )
  }
  return ctx
}
