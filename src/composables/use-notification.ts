import { useContext } from '@/Context'
import { readonly } from 'vue'
import { useID } from './use-id'

export interface NotifyOptions {
  persist?: boolean
  duration: number
  closable?: boolean
}

export interface NotifyReturn {
  id: string
}

export interface NotificationItem<T extends Record<string, any> = Record<string, any>>
  extends NotifyOptions {
  id: string
  content: T
}

export function useNotification<T extends Record<string, any>>(id?: string | symbol) {
  const { notifications } = useContext<T>(id)

  const notify = (content: T, options: NotifyOptions): NotifyReturn => {
    const notificationId = useID()
    const notification: NotificationItem<T> = { id: notificationId, ...options, content }
    notifications.value = [notification, ...notifications.value]
    return {
      id: notificationId,
    }
  }

  const dismiss = (id: string) => {
    notifications.value = notifications.value.filter((item) => item.id !== id)
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
