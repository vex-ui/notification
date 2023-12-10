import { useContext } from '@/Context'
import { readonly, type Ref } from 'vue'
import { useID } from '.'
import type { NotifyOptions, NotificationItem } from '..'

export function useNotification<T extends Record<string, any>>(uid?: string | symbol) {
  const { notifications } = useContext(uid)

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
