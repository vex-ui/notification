<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useSwipe } from '@vueuse/core'
import { useTimer } from '@/composables'
import { useGlobalContext } from './GlobalContext'

//=================================================================================================
// component meta
//=================================================================================================

const props = withDefaults(
  defineProps<{
    uuid: string
    persist?: boolean
    duration?: number
    swipeThreshold?: number
  }>(),
  {
    duration: 10000,
    swipeThreshold: 0.5,
  }
)

const emit = defineEmits<{
  timerStop: []
  timerStart: []
  timerPause: []
  timerResume: []
}>()

const { dismiss } = useGlobalContext()

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
  dismiss(props.uuid)
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
 * The swiping logic basically changes the position of a notification based on user interaction.
 * When a user swipes the notification, depending on the direction and distance of the swipe,
 * the `left` value is updated.
 * If the swipe is significant enough (meets the `swipeThreshold`),
 * the notification is fully dismissed, i.e., moved to the left end (`left.value = '100%'`)
 * If the swipe isn't significant enough,
 * the notification returns to its initial position (`left.value = '0'`).
 */

const left = ref()
const notificationEl = ref<HTMLElement | null>(null)
const notificationWidth = computed(() => notificationEl.value?.offsetWidth ?? 0)
const isSwipingRight = computed(() => lengthX.value < 0)

const { lengthX } = useSwipe(notificationEl, {
  passive: false,
  onSwipeStart() {
    pauseTimer()
  },
  onSwipe() {
    if (isSwipingRight.value) {
      const length = Math.abs(lengthX.value)
      left.value = `${length}px`
    } else {
      left.value = undefined
    }
  },
  onSwipeEnd() {
    if (
      isSwipingRight.value &&
      notificationWidth.value > 0 &&
      Math.abs(lengthX.value) / notificationWidth.value >= props.swipeThreshold
    ) {
      stopTimer()
    } else {
      resumeTimer()
    }
    left.value = undefined
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
    tabindex="0"
    role="status"
    :style="{ left }"
    aria-atomic="true"
    @keydown.esc="stopTimer"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
    @focus="pauseTimer"
    @blur="resumeTimer"
  >
    <slot />
  </div>
</template>
