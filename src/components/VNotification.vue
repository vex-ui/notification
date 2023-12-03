<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useSwipe } from '@vueuse/core'
import { useTimer } from '@/composables'

//=================================================================================================
// component meta
//=================================================================================================

const props = withDefaults(
  defineProps<{
    duration?: number
    persist?: boolean
  }>(),
  {
    duration: 10000,
  }
)

const emit = defineEmits<{
  timerStop: []
  timerStart: []
  timerPause: []
  timerResume: []
}>()

const swipeDismissThreshold = 0.5

//=================================================================================================
// timer
//=================================================================================================

const timer = !props.persist ? useTimer(props.duration, stopTimer) : undefined

function startTimer() {
  timer?.start()
  emit('timerStart')
}

function stopTimer() {
  timer?.stop()
  emit('timerStop')
}

function pauseTimer() {
  timer?.pause()
  emit('timerPause')
}

function resumeTimer() {
  timer?.resume()
  emit('timerResume')
}

if (timer) {
  onMounted(startTimer)
}

//=================================================================================================
// swipe
//=================================================================================================

/*
 * The swiping logic basically changes the position and opacity of a notification based on user interaction.
 * When a user swipes the notification, depending on the direction and distance of the swipe,
 * the `left` value and `opacity` value are updated.
 * If the swipe is significant enough (meets the `swipeDismissThreshold`),
 * the notification is fully dismissed, i.e., moved to the left end (`left.value = '100%'`)
 * and made fully transparent (`opacity.value = 0`). If the swipe isn't significant enough,
 * the notification returns to its initial position (`left.value = '0'`) and full opacity (`opacity.value = 1`).
 */

const left = ref('0')
const opacity = ref(1)
const notificationEl = ref<HTMLElement | null>(null)
const notificationWidth = computed(() => notificationEl.value?.offsetWidth ?? 0)
const isSwipingRight = computed(() => lengthX.value < 0)

const { isSwiping, lengthX } = useSwipe(notificationEl, {
  passive: false,
  onSwipeStart() {
    pauseTimer()
  },
  onSwipe() {
    if (isSwipingRight.value) {
      const length = Math.abs(lengthX.value)
      left.value = `${length}px`
      opacity.value = 1.1 - length / notificationWidth.value
    } else {
      left.value = '0'
      opacity.value = 1
    }
  },
  onSwipeEnd() {
    if (
      isSwipingRight.value &&
      notificationWidth.value > 0 &&
      Math.abs(lengthX.value) / notificationWidth.value >= swipeDismissThreshold
    ) {
      left.value = '100%'
      opacity.value = 0
      stopTimer()
    } else {
      left.value = '0'
      opacity.value = 1
      resumeTimer()
    }
  },
})

defineExpose({
  stopTimer,
  pauseTimer,
  resumeTimer,
})
</script>

<template>
  <div
    ref="notificationEl"
    class="relative text-base rounded-sm bg-white shadow pointer-events-auto flex shrink-0 items-start gap-2 p-4 w-20rem max-w-[calc(100vw-2rem)] overflow-hidden"
    :class="{
      'transition-all': !isSwiping,
    }"
    tabindex="0"
    role="status"
    :style="{ left, opacity }"
    aria-atomic="true"
    @keydown.esc="stopTimer"
    @focus="pauseTimer"
    @blur="resumeTimer"
  >
    <slot />
  </div>
</template>
