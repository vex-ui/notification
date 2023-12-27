import { useContext } from '@/Context'
import { readonly, type Ref } from 'vue'
import { useID } from './use-id'
import type { NotifyOptions, NotificationItem } from '@/plugin'

export function useNotification<T extends Record<string, any>>(uid?: string | symbol) {
  const { notifications } = useContext<T>(uid)

  const notify = (meta: T, options: NotifyOptions) => {
    const uuid = useID()
    const notification: NotificationItem<T> = { uuid, ...options, meta }
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
    notifications: readonly(notifications),
  }
}
