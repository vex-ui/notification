<script setup lang="ts">
import { useTimer } from '@/composables'
import { useSwipe } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { useNotificationProviderContext } from './VNotificationProvider.vue'

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
  useNotificationProviderContext()

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
const transform = ref('')
const notificationEl = ref<HTMLElement | null>(null)
const width = computed(() => notificationEl.value?.offsetWidth ?? 0)
const height = computed(() => notificationEl.value?.offsetHeight ?? 0)

let swipeStartTime: number

const isSwipingInDismissDirection = computed(() => swipeDismissDir.value === direction.value)

const { lengthX, lengthY, direction } = useSwipe(notificationEl, {
  onSwipeStart() {
    pauseTimer()
    swipeStartTime = Date.now()
  },
  onSwipe() {
    const isSwipeHorizontal = HORIZONTAL_DIRECTIONS.includes(direction.value)

    if (!isSwipingInDismissDirection.value) {
      transform.value = ''
      return
    }

    if (isSwipeHorizontal) {
      transform.value = `translateX(${lengthX.value * -1}px)`
    } else {
      transform.value = `translateY(${lengthY.value * -1}px)`
    }
  },
  onSwipeEnd() {
    const swipeEndTime = Date.now()
    const swipeDuration = swipeEndTime - swipeStartTime
    const isSwipeHorizontal = HORIZONTAL_DIRECTIONS.includes(direction.value)
    const swipeDistance = isSwipeHorizontal ? lengthX.value : lengthY.value
    const elementLength = isSwipeHorizontal ? width.value : height.value

    if (elementLength <= 0) {
      stopTimer()
      transform.value = ''
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
      transform.value = ''
      stopTimer()
    } else {
      transform.value = ''
      resumeTimer()
    }
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
    ref="notificationEl"
    tabindex="0"
    role="status"
    :style="{ transform }"
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
