<script setup lang="ts">
import { useTimer } from '@/composables'
import { useSwipe } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { injectToastProvider } from './ToastProvider.vue'

const props = withDefaults(
  defineProps<{
    uuid: string
    persist?: boolean
    duration?: number
  }>(),
  {}
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

if (timer) {
  onMounted(startTimer)
}

//=================================================================================================
// swipe
//=================================================================================================

const HORIZONTAL_DIRECTIONS = ['left', 'right']
const toastEl = ref<HTMLElement | null>(null)
const swipeState = ref<'start' | 'move' | 'cancel' | 'end' | 'idle'>('idle')
const distanceX = ref('0')
const distanceY = ref('0')

let swipeStartTime: number

const isSwipingInDismissDirection = computed(() => swipeDismissDir.value === direction.value)

const { lengthX, lengthY, direction } = useSwipe(toastEl, {
  onSwipeStart() {
    swipeState.value = 'start'
    swipeStartTime = Date.now()
    pauseTimer()
  },
  onSwipe() {
    if (!isSwipingInDismissDirection.value) return
    if (HORIZONTAL_DIRECTIONS.includes(direction.value)) {
      distanceY.value = '0'
      distanceX.value = `${lengthX.value * -1}px`
    } else {
      distanceX.value = '0'
      distanceY.value = `${lengthY.value * -1}px`
    }
    swipeState.value = 'move'
  },
  onSwipeEnd() {
    const swipeEndTime = Date.now()
    const swipeDuration = swipeEndTime - swipeStartTime
    const { width, height } = toastEl.value?.getBoundingClientRect() ?? {}
    const isSwipeHorizontal = HORIZONTAL_DIRECTIONS.includes(direction.value)
    const swipeDistance = isSwipeHorizontal ? lengthX.value : lengthY.value
    const elementLength = (isSwipeHorizontal ? width : height) ?? 0

    if (elementLength <= 0) {
      swipeState.value = 'end'
      distanceX.value = '0'
      distanceY.value = '0'
      stopTimer()
      return
    }

    const swipeVelocity = Math.abs(swipeDistance) / swipeDuration
    const swipeRatio = Math.abs(swipeDistance) / elementLength
    const isSwipeDistanceSufficient = swipeRatio >= swipeThreshold.value
    const isSwipeVelocitySufficient = swipeVelocity >= swipeVelocityThreshold.value

    if (
      isSwipingInDismissDirection.value &&
      (isSwipeDistanceSufficient || isSwipeVelocitySufficient)
    ) {
      swipeState.value = 'end'
      stopTimer()
    } else {
      swipeState.value = 'cancel'
      resumeTimer()
    }
    distanceX.value = '0'
    distanceY.value = '0'
  },
  threshold: 1,
  passive: false,
})

defineExpose({
  stopTimer,
  pauseTimer,
  resumeTimer,
})
</script>

<template>
  <div
    ref="toastEl"
    tabindex="0"
    role="status"
    :style="{ '--vex-swipe-distance-x': distanceX, '--vex-swipe-distance-y': distanceY }"
    :data-swipe="swipeState"
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
