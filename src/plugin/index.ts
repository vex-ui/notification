import { DEFAULT_NOTIFICATION_CONTEXT_UID } from '@/Context'
import type { Plugin, Ref } from 'vue'
import { ref } from 'vue'

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
