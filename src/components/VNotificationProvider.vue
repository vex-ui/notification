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
const { notifications } = ctx

const NotificationProviderEl = ref<HTMLElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === props.focusKey && !e.altKey && !e.shiftKey && !e.ctrlKey) {
    NotificationProviderEl.value?.focus()
  }
}

function removeNotification(item: NotificationItem) {
  remove(notifications.value, item)
}
</script>

<template>
  <div
    ref="NotificationProviderEl"
    id="vex-notification-provider"
    aria-label="Notifications (F8)"
    v-bind="$attrs"
    tabindex="-1"
    role="region"
    aria-live="polite"
    @keydown="onKeydown"
  >
    <VNotification
      v-for="item in notifications"
      :key="item.uuid"
      :duration="item.duration"
      :persist="item.persist"
      @timer-stop="removeNotification(item)"
      >this is a notification</VNotification
    >
  </div>
</template>
