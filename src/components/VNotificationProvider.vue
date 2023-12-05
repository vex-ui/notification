<script setup lang="ts">
import { inject, ref } from 'vue'
import VNotification from './VNotification.vue'
import { APP_CONTEXT, type NotificationItem } from '.'
import { remove } from '@/utils'

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

const ctx = inject(APP_CONTEXT, null)
if (!ctx) {
  throw new Error('[vex] app context was not found')
}
const { notifications, removeNotification } = ctx

const NotificationProviderEl = ref<HTMLElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === props.focusKey && !e.altKey && !e.shiftKey && !e.ctrlKey) {
    NotificationProviderEl.value?.focus()
  }
}
</script>

<template>
  <div
    ref="NotificationProviderEl"
    id="vex-notification-provider"
    aria-label="Notifications (F8)"
    class="fixed top-0 left-0 w-screen h-screen p-4 overflow-hidden pointer-events-none flex flex-col justify-start items-end gap-4 z-1000"
    v-bind="$attrs"
    tabindex="-1"
    role="region"
    aria-live="polite"
    @keydown="onKeydown"
  >
    <slot :notifications="notifications" :remove-notification="removeNotification" />
  </div>
</template>
