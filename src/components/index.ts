import { useID } from '@/composables'
import type { Plugin, Ref } from 'vue'
import { readonly, ref } from 'vue'
import { GLOBAL_INJECTION_KEY } from './GlobalContext'

export interface PluginOptions {}

export const notifications: Ref<NotificationItem[]> = ref([])

function dismiss(uuid: string): void {
  notifications.value = notifications.value.filter((item) => item.uuid !== uuid)
}

export const plugin: Plugin<PluginOptions> = {
  install(app, options = {}) {
    app.provide(GLOBAL_INJECTION_KEY, { ...options, notifications, dismiss })
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

export function useNotification<T extends Record<string, any>>() {
  const notify = (meta: T, options: NotifyOptions) => {
    const uuid = useID()
    const notification: NotificationItem = { uuid, ...options, meta }
    notifications.value.unshift(notification)
    return {
      uuid,
      dismiss: () => dismiss(uuid),
    }
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
