<script setup lang="ts">
import { inject, ref } from 'vue'
import { APP_CONTEXT } from '.'

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
  throw new Error('[vex] notifications app context was not found')
}
const { notifications, dismiss } = ctx

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
    aria-label="Notifications (F8)"
    v-bind="$attrs"
    tabindex="-1"
    role="region"
    aria-live="polite"
    @keydown="onKeydown"
  >
    <slot :notifications="notifications" :dismiss="dismiss" />
  </div>
</template>
