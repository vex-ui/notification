import { h, render } from 'vue'
import type { VNode, Component } from 'vue'
import NotificationRoot from './VNotificationRoot.vue'
import { useID } from '@/composables'

export interface NotifyOptions {
  body?: string | Component
  title?: string | Component
  persist?: boolean
  duration?: number
  closable?: boolean
  hideProgress?: boolean
  customContent?: Component
}

export interface NotificationItem extends NotifyOptions {
  key: string
}

let Root: VNode | null = null

function useNotification() {
  if (!Root) {
    Root = h(NotificationRoot)
    render(Root, document.createDocumentFragment() as unknown as Element)
  }

  return {
    notify: (options: NotifyOptions = {}) => {
      const key = useID()
      const notification = { key, ...options }
      Root?.component?.exposed?.addNotification(notification)
      return {
        key,
        remove: () => Root?.component?.exposed?.removeNotification(notification),
      }
    },
    clearAllNotification: () => {
      Root?.component?.exposed?.clearAll()
    },
  }
}

export { useNotification }
