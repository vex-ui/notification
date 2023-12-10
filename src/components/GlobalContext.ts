import { inject, type InjectionKey, type Ref } from 'vue'
import type { PluginOptions, NotificationItem } from '.'

export interface GlobalContext extends Required<PluginOptions> {
  notifications: Ref<NotificationItem[]>
  dismiss: (uuid: string) => void
}

export const GLOBAL_INJECTION_KEY = Symbol() as InjectionKey<GlobalContext>

export function useGlobalContext() {
  const ctx = inject(GLOBAL_INJECTION_KEY, null)
  if (!ctx) {
    throw new Error(
      '[vex] notifications app context was not found, make sure you have installed the plugin'
    )
  }
  return ctx
}
