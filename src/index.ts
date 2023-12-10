export { useNotification } from '@/composables'
export { VNotification, VNotificationProvider } from './components'

import { plugin } from './plugin'
export default plugin

export type { NotificationItem, NotifyOptions, PluginOptions } from '@/plugin'
