import { useID } from '@/composables'
import { remove } from '@/utils'
import type { Component, InjectionKey, Plugin, Ref } from 'vue'
import { ref } from 'vue'

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
  uuid: string
}

export interface NotificationPluginOptions {}

export interface AppContext extends NotificationPluginOptions {
  notifications: Ref<NotificationItem[]>
}

export const APP_CONTEXT = Symbol() as InjectionKey<AppContext>
export const notifications: Ref<NotificationItem[]> = ref([])

export const plugin: Plugin<NotificationPluginOptions> = {
  install(app, options) {
    app.provide(APP_CONTEXT, { ...options, notifications })
  },
}

export function useNotification() {
  return {
    notify: (options: NotifyOptions = {}) => {
      const uuid = useID()
      const notification = { uuid, ...options }
      notifications.value.push(notification)
      return {
        remove: () => remove(notifications.value, notification),
      }
    },
    clearAllNotification: () => {
      notifications.value = []
    },
  }
}
