<script lang="ts">
export const NOTIFICATION_INJECTION_KEY = Symbol() as InjectionKey<{}>
</script>

<script setup lang="ts">
import { remove } from '@/utils'
import { ref, type InjectionKey, provide } from 'vue'
import type { NotificationItem } from '.'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    focusKey?: string
  }>(),
  {
    focusKey: 'F8',
  }
)

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
  if (e.key === props.focusKey && !e.altKey && !e.shiftKey && !e.ctrlKey) {
    NotificationRootEl.value?.focus()
  }
}

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
      v-bind="$attrs"
      tabindex="-1"
      role="region"
      aria-live="polite"
      @keydown="onKeydown"
    >
      <slot />
    </div>
  </Teleport>
</template>
