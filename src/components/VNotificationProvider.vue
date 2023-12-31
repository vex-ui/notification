<script lang="ts">
export type Directions = 'up' | 'down' | 'left' | 'right' | 'none'

export interface NotificationProviderContext {
  swipeThreshold: Ref<number>
  swipeDismissDir: Ref<Directions>
  defaultDuration: Ref<number>
  swipeVelocityThreshold: Ref<number>
}

const NOTIFICATION_PROVIDER_KEY = Symbol() as InjectionKey<NotificationProviderContext>

export function useNotificationProviderContext(): NotificationProviderContext {
  const ctx = inject(NOTIFICATION_PROVIDER_KEY, null)
  if (!ctx) {
    throw new Error('[vex] notification provider context was not found')
  } else {
    return ctx
  }
}
</script>

<script setup lang="ts">
import { inject, provide, ref, toRef, type InjectionKey, type Ref } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    focusKey?: string
    swipeThreshold?: number
    defaultDuration?: number
    swipeDismissDir?: Directions
    swipeVelocityThreshold?: number
  }>(),
  {
    focusKey: 'F8',
    swipeThreshold: 0.5,
    defaultDuration: 10_000,
    swipeDismissDir: 'right',
    swipeVelocityThreshold: 0.2,
  }
)

const NotificationProviderEl = ref<HTMLElement | null>(null)

provide(NOTIFICATION_PROVIDER_KEY, {
  swipeDismissDir: toRef(() => props.swipeDismissDir),
  swipeThreshold: toRef(() => props.swipeThreshold),
  defaultDuration: toRef(() => props.defaultDuration),
  swipeVelocityThreshold: toRef(() => props.swipeVelocityThreshold),
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
