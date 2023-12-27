<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useSwipe } from '@vueuse/core'
import { useTimer } from '@/composables'

//=================================================================================================
// component meta
//=================================================================================================

const props = withDefaults(
  defineProps<{
    uuid: string
    persist?: boolean
    duration?: number
    swipeThreshold?: number
    swipeVelocityThreshold?: number
  }>(),
  {
    duration: 10000,
    swipeThreshold: 0.5,
    swipeVelocityThreshold: 0.2,
  }
)

const emit = defineEmits<{
  timerStop: []
  timerStart: []
  timerPause: []
  timerResume: []
}>()

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
 * The swiping logic is responsible for handling user interactions with the notification.
 * It primarily focuses on the changes in the notification's position as a user swipes it.
 *
 * The logic works as follows:
 * 1. When a user starts swiping the notification, the swipe start time is recorded and the notification's timer is paused.
 * 2. As the user continues to swipe, the notification's position is updated based on the swipe direction and distance.
 * 3. If the user is swiping to the right, the `positionX` value is set to the swipe distance.
 * 4. If the user is not swiping to the right, the `positionX` value is reset.
 * 5. When the user ends the swipe, the swipe end time is recorded. The swipe duration and velocity are then calculated.
 * 6. If the user swiped to the right and the swipe was either significant enough (i.e., the swipe distance divided by the notification width is greater than or equal to the `swipeThreshold`)
 *    or fast enough (i.e., the swipe velocity is greater than or equal to a defined velocity threshold), the notification's timer is stopped.
 * 7. If the swipe was not significant or fast enough, the notification's timer is resumed and the notification returns to its initial position.
 */

const positionX = ref('')
const notificationEl = ref<HTMLElement | null>(null)
const width = computed(() => notificationEl.value?.offsetWidth ?? 0)
const isSwipingRight = computed(() => lengthX.value < 0)

let swipeStartTime: number

const { lengthX } = useSwipe(notificationEl, {
  passive: false,
  onSwipeStart() {
    pauseTimer()
    swipeStartTime = Date.now()
  },
  onSwipe() {
    if (isSwipingRight.value) {
      const length = Math.abs(lengthX.value)
      positionX.value = `${length}px`
    } else {
      positionX.value = ''
    }
  },
  onSwipeEnd() {
    const swipeEndTime = Date.now()
    const swipeDuration = swipeEndTime - swipeStartTime
    const swipeVelocity = Math.abs(lengthX.value) / swipeDuration
    const swipeDistance = Math.abs(lengthX.value) / width.value

    const isSwipeDistanceSufficient = width.value > 0 && swipeDistance >= props.swipeThreshold
    const isSwipeFastEnough = swipeVelocity >= props.swipeVelocityThreshold

    if (isSwipingRight.value && (isSwipeDistanceSufficient || isSwipeFastEnough)) {
      stopTimer()
    } else {
      resumeTimer()
    }
    positionX.value = ''
  },
  threshold: 1,
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
    :style="{ left: positionX }"
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
