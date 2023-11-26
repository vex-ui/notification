<script setup lang="ts">
import type { NotificationItem } from '.'
import Notification from './VNotification.vue'
import { useEventListener } from '@vueuse/core'
import { isString, remove } from '@/utils'
import { ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 add/remove items
//----------------------------------------------------------------------------------------------------

const items = ref<NotificationItem[]>([])
const NotificationRootEl = ref<HTMLElement | null>(null)

function addNotification(notification: NotificationItem) {
  items.value.unshift(notification)
}

function removeNotification(notification: NotificationItem) {
  remove(items.value, notification)
}

function removeAll() {
  items.value = []
}

//----------------------------------------------------------------------------------------------------
// 📌 keyboard navigation
//----------------------------------------------------------------------------------------------------

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'F8' && !e.altKey && !e.shiftKey && !e.ctrlKey) {
    NotificationRootEl.value?.focus()
  }
})

//----------------------------------------------------------------------------------------------------
// 📌 animation
//----------------------------------------------------------------------------------------------------

async function onEnter(el: HTMLElement, done: () => void) {
  done()
}

function onBeforeLeave(el: HTMLElement) {}

async function onLeave(el: HTMLElement, done: () => void) {
  done()
}

//----------------------------------------------------------------------------------------------------

defineExpose({
  removeAll,
  addNotification,
  removeNotification,
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="NotificationRootEl"
      id="vex-notification-root"
      aria-label="Notifications (F8)"
      tabindex="-1"
      role="region"
      aria-live="polite"
    >
      <Notification
        v-for="item in items"
        :key="item.key"
        :duration="item.duration"
        :persist="item.persist"
        @stop-timer="removeNotification(item)"
      >
        <template v-if="item.customContent" #default>
          <Component :is="item.customContent" />
        </template>

        <template #title>
          <span v-if="isString(item.title)" class="vex-notification-content-title">
            {{ item.title }}
          </span>

          <Component v-else :is="item.title" />
        </template>

        <template #body>
          <p v-if="isString(item.body)" class="vex-notification-content-body">
            {{ item.body }}
          </p>

          <Component v-else :is="item.body" />
        </template>

        <template v-if="item.icon" #icon>
          <Component :is="item.icon" />
        </template>
      </Notification>
    </div>
  </Teleport>
</template>
