<script lang="ts">
export type Directions = 'up' | 'down' | 'left' | 'right' | 'none'

export interface ToastProviderContext {
  swipeThreshold: Ref<number>
  swipeDismissDir: Ref<Directions>
  defaultDuration: Ref<number>
  swipeVelocityThreshold: Ref<number>
}

const TOAST_PROVIDER_KEY = Symbol() as InjectionKey<ToastProviderContext>

export function injectToastProvider(): ToastProviderContext {
  const ctx = inject(TOAST_PROVIDER_KEY, null)
  if (!ctx) {
    throw new Error('[vex] toast provider context was not found')
  } else {
    return ctx
  }
}
</script>

<script setup lang="ts">
import { inject, provide, ref, toRef, type InjectionKey, type Ref } from 'vue'

const props = withDefaults(
  defineProps<{
    focusKey?: string
    swipeThreshold?: number
    defaultDuration?: number
    swipeDismissDir?: Directions
    swipeVelocityThreshold?: number
    ariaLive?: 'polite' | 'assertive' | 'off'
  }>(),
  {
    focusKey: 'F8',
    swipeThreshold: 0.5,
    defaultDuration: 10_000,
    swipeDismissDir: 'right',
    swipeVelocityThreshold: 0.2,
    ariaLive: 'polite',
  }
)

const ToastProviderEl = ref<HTMLElement | null>(null)

provide(TOAST_PROVIDER_KEY, {
  swipeDismissDir: toRef(() => props.swipeDismissDir),
  swipeThreshold: toRef(() => props.swipeThreshold),
  defaultDuration: toRef(() => props.defaultDuration),
  swipeVelocityThreshold: toRef(() => props.swipeVelocityThreshold),
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === props.focusKey && !e.altKey && !e.shiftKey && !e.ctrlKey) {
    ToastProviderEl.value?.focus()
  }
}
</script>

<template>
  <div
    ref="ToastProviderEl"
    role="region"
    tabindex="-1"
    :aria-live="props.ariaLive"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
