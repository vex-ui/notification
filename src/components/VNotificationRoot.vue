<script setup lang="ts">
import { remove } from '@/utils'
import { ref, type InjectionKey, provide } from 'vue'
import type { NotificationItem } from '.'

const items = ref<NotificationItem[]>([])
const NotificationRootEl = ref<HTMLElement | null>(null)

function addNotification(notification: NotificationItem) {
  items.value.unshift(notification)
}

function removeNotification(notification: NotificationItem) {
  remove(items.value, notification)
}

function clearAll() {
  items.value = []
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'F8' && !e.altKey && !e.shiftKey && !e.ctrlKey) {
    NotificationRootEl.value?.focus()
  }
}

const NOTIFICATION_INJECTION_KEY = Symbol() as InjectionKey<{}>

provide(NOTIFICATION_INJECTION_KEY, {})

defineExpose({
  clearAll,
  addNotification,
  removeNotification,
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="NotificationRootEl"
      id="vex-notification-root"
      aria-label="Notifications (F8)"
      tabindex="-1"
      role="region"
      aria-live="polite"
      @keydown="onKeydown"
    ></div>
  </Teleport>
</template>
