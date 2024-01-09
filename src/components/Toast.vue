<script setup lang="ts">
import { useTimer } from '@/composables'
import { useSwipe } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import { injectToastProvider } from './ToastProvider.vue'

const props = withDefaults(
  defineProps<{
    uuid: string
    persist?: boolean
    duration?: number
    autoStartTimer?: boolean
  }>(),
  {
    autoStartTimer: true,
  }
)

const emit = defineEmits<{
  timerStop: []
  timerStart: []
  timerPause: []
  timerResume: []
}>()

const { swipeThreshold, swipeVelocityThreshold, defaultDuration, swipeDismissDir } =
  injectToastProvider()

//=================================================================================================
// timer
//=================================================================================================

const timer = !props.persist
  ? useTimer(props.duration ?? defaultDuration.value, stopTimer)
  : undefined

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

if (timer && props.autoStartTimer) {
  onMounted(startTimer)
}

//=================================================================================================
// swipe
//=================================================================================================

const toastEl = ref<HTMLElement | null>(null)
let swipeStartTime: number

const { lengthX, lengthY, direction, isSwiping } = useSwipe(toastEl, {
  onSwipeStart() {
    swipeStartTime = Date.now()
    pauseTimer()
  },
  onSwipeEnd() {
    const { swipeRatio, swipeVelocity } = getSwipeProperties()
    const isSwipingInDismissDirection = swipeDismissDir.value === direction.value

    if (isSwipingInDismissDirection && isSwipeSufficient(swipeRatio, swipeVelocity)) {
      stopTimer()
    } else {
      resumeTimer()
    }
  },
  threshold: 10,
  passive: false,
})

watch([lengthX, lengthY], ([x, y]) => {
  toastEl.value?.style.setProperty('--vex-swipe-distance-x', `${x * -1}px`)
  toastEl.value?.style.setProperty('--vex-swipe-distance-y', `${y * -1}px`)
})

function getSwipeProperties() {
  const { width, height } = toastEl.value?.getBoundingClientRect() ?? {}
  const isSwipeHorizontal = ['left', 'right'].includes(direction.value)
  const elementLength = (isSwipeHorizontal ? width : height) ?? 0

  const swipeDistance = isSwipeHorizontal ? lengthX.value : lengthY.value
  const swipeDuration = Date.now() - swipeStartTime

  const swipeRatio = Math.abs(swipeDistance) / elementLength
  const swipeVelocity = Math.abs(swipeDistance) / swipeDuration

  return { swipeRatio, swipeVelocity }
}

function isSwipeSufficient(swipeRatio: number, swipeVelocity: number): boolean {
  const isSwipeDistanceSufficient = swipeRatio >= swipeThreshold.value
  const isSwipeVelocitySufficient = swipeVelocity >= swipeVelocityThreshold.value
  return isSwipeDistanceSufficient || isSwipeVelocitySufficient
}

defineExpose({
  stopTimer,
  startTimer,
  pauseTimer,
  resumeTimer,
})
</script>

<template>
  <div
    ref="toastEl"
    tabindex="0"
    role="status"
    :data-swiping="isSwiping"
    :data-swipe-dir="direction"
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
