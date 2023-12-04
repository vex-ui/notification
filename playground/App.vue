<script setup lang="ts">
// import { onMounted } from 'vue'
import { useNotification } from '../src/components'
import VNotificationProvider from '../src/components/VNotificationProvider.vue'
import VNotification from '../src/components/VNotification.vue'
// import TransitionDemo from './TransitionDemo.vue'

const { notify, clearAllNotification } = useNotification()

let count = 0
const send = () => {
  notify({
    title: 'title',
    body: 'body' + ++count,
    duration: 2000,
  })
}
</script>

<template>
  <main class="h-screen grid place-items-center">
    <button
      class="p4 py-2 bg-black text-white rounded-sm shadow hover:bg-neutral-700"
      @click="send"
    >
      notify
    </button>

    <Teleport to="body">
      <VNotificationProvider #="{ notifications }">
        <TransitionGroup
          enterActiveClass="transition-all duration-500 ease-in-out"
          leaveActiveClass="transition-all duration-500 ease-in-out absolute"
          enterFromClass="translate-x-full"
          leaveToClass="translate-x-full"
        >
          <VNotification
            v-for="item in notifications"
            role="status"
            aria-atomic="true"
            :uuid="item.uuid"
            :key="item.uuid"
            :duration="item.duration"
            :persist="item.persist"
            >this is a notification
          </VNotification>
        </TransitionGroup>
      </VNotificationProvider>
    </Teleport>
  </main>
</template>
