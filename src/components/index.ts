import { useID } from '@/composables'
import { remove } from '@/utils'
import type { Component, InjectionKey, Plugin, Ref } from 'vue'
import { createApp, shallowRef } from 'vue'
import NotificationRoot from './VNotificationRoot.vue'

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

export interface NotificationPluginOptions {}

export interface AppContext extends NotificationPluginOptions {
  notifications: Ref<NotificationItem[]>
}

export const APP_CONTEXT = Symbol() as InjectionKey<AppContext>

export const NotificationPlugin: Plugin = (options: NotificationPluginOptions) => {
  const app = createApp(NotificationRoot)
  const notifications = shallowRef<NotificationItem[]>([])
  app.provide(APP_CONTEXT, { ...options, notifications })
  app.mount(document.appendChild(document.createElement('div')))

  return {
    notify: (options: NotifyOptions = {}) => {
      const key = useID()
      const notification = { key, ...options }
      notifications.value.push(notification)
      return {
        key,
        remove: () => remove(notifications.value, notification),
      }
    },
    clearAllNotification: () => {
      notifications.value = []
    },
  }
}
