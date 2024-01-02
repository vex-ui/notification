import { DEFAULT_TOAST_SERVICE_ID } from '@/Context'
import type { Plugin } from 'vue'
import { shallowRef } from 'vue'

export interface ToastPluginOptions {
  id?: string | symbol
}

export const VexToastPlugin: Plugin<ToastPluginOptions> = {
  install(app, options = {}) {
    const { id } = options
    const toasts = shallowRef([])
    app.provide(id ?? DEFAULT_TOAST_SERVICE_ID, { id, toasts })
  },
}
