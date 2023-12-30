<script>
export interface NotificationProviderContext {
  swipeThreshold: Ref<number>
  defaultDuration: Ref<number>
  swipeVelocityThreshold: Ref<number>
}

const NOTIFICATION_PROVIDER_KEY = Symbol() as InjectionKey<NotificationProviderContext>

export function useNotificationProviderContext(): NotificationProviderContext{
  const ctx = inject(NOTIFICATION_PROVIDER_KEY, null)
  if(!ctx){
    throw new Error('[vex] notification provider context was not found')
  } else {
    return ctx
  }
}
</script>

<script setup lang="ts">
import { ref, type InjectionKey, inject, provide, toRef, type Ref } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    focusKey?: string
    swipeThreshold?: number
    defaultDuration?: number
    swipeVelocityThreshold?: number
  }>(),
  {
    focusKey: 'F8',
    swipeThreshold: 0.5,
    defaultDuration: 10_000,
    swipeVelocityThreshold: 0.2,
  }
)

const NotificationProviderEl = ref<HTMLElement | null>(null)

provide(NOTIFICATION_PROVIDER_KEY, {
  swipeThreshold: toRef(() => props.swipeThreshold),
  swipeVelocityThreshold: toRef(() => props.swipeVelocityThreshold),
  defaultDuration: toRef(() => props.defaultDuration),
})

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
    <slot />
  </div>
</template>
