import { DEFAULT_NOTIFICATION_CONTEXT_ID } from '@/Context'
import type { Plugin } from 'vue'
import { shallowRef } from 'vue'

export interface NotificationPluginOptions {
  id?: string | symbol
}

export const VexNotificationPlugin: Plugin<NotificationPluginOptions> = {
  install(app, options = {}) {
    const { id } = options
    const notifications = shallowRef([])
    app.provide(id ?? DEFAULT_NOTIFICATION_CONTEXT_ID, { id, notifications })
  },
}
