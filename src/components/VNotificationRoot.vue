<script setup lang="ts">
import { ref } from 'vue'

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

const NotificationRootEl = ref<HTMLElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === props.focusKey && !e.altKey && !e.shiftKey && !e.ctrlKey) {
    NotificationRootEl.value?.focus()
  }
}
</script>

<template>
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
</template>
