import { h, render } from 'vue'
import type { VNode, Component } from 'vue'
import NotificationRoot from './VNotificationRoot.vue'
import { useID } from '@/composables'

export interface NotifyOptions {
  duration?: number
  persist?: boolean
  closable?: boolean
  hideProgress?: boolean
  title?: string | Component
  body?: string | Component
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
      const notification = { key: useID(), ...options }
      Root?.component?.exposed?.addNotification(notification)
      return () => Root?.component?.exposed?.removeNotification(notification)
    },
    clearAllNotification: () => {
      Root?.component?.exposed?.clearAll()
    },
  }
}

export { useNotification }
