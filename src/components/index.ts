import { useID } from '@/composables'
import type { Plugin, Ref } from 'vue'
import { readonly, ref } from 'vue'
import { DEFAULT_NOTIFICATION_CONTEXT_UID, useNotificationContext } from './Context'

export interface PluginOptions {
  uid?: string | symbol
}

export const plugin: Plugin<PluginOptions> = {
  install(app, options = {}) {
    const { uid } = options
    const notifications: Ref<NotificationItem[]> = ref([])
    app.provide(uid ?? DEFAULT_NOTIFICATION_CONTEXT_UID, { uid, notifications })
  },
}

export interface NotifyOptions {
  persist?: boolean
  duration: number
  closable?: boolean
}

export interface NotificationItem<T extends Record<string, any> = Record<string, any>>
  extends NotifyOptions {
  uuid: string
  meta: T
}

export function useNotification<T extends Record<string, any>>(uid?: string | symbol) {
  const { notifications } = useNotificationContext(uid)

  const notify = (meta: T, options: NotifyOptions) => {
    const uuid = useID()
    const notification: NotificationItem = { uuid, ...options, meta }
    notifications.value.unshift(notification)
    return {
      uuid,
      dismiss: () => dismiss(uuid),
    }
  }

  const dismiss = (uuid: string) => {
    notifications.value = notifications.value.filter((item) => item.uuid !== uuid)
  }

  const dismissAllNotifications = () => {
    notifications.value = []
  }

  return {
    notify,
    dismiss,
    dismissAllNotifications,
    notifications: readonly(notifications as Ref<NotificationItem<T>[]>),
  }
}
