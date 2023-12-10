<script setup lang="ts">
// import { onMounted } from 'vue'
import { useNotification } from '../src/components'
import VNotificationProvider from '../src/components/VNotificationProvider.vue'
import VNotification from '../src/components/VNotification.vue'
// import TransitionDemo from './TransitionDemo.vue'

const { notify, notifications } = useNotification<{
  title: string
  body?: string
}>()

const send = () => {
  notify(
    {
      title: 'hello world',
    },
    {
      duration: 20000,
    }
  )
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
      <VNotificationProvider
        class="fixed top-0 left-0 w-screen h-screen p-4 overflow-hidden pointer-events-none flex flex-col justify-start items-end gap-4 z-1000"
        #="{ dismiss }"
      >
        <TransitionGroup
          enterActiveClass="transition-all duration-500 ease-in-out"
          leaveActiveClass="transition-all duration-500 ease-in-out absolute"
          enterFromClass="translate-x-full"
          leaveToClass="translate-x-full"
        >
          <VNotification
            v-for="item in notifications"
            :key="item.uuid"
            v-bind="item"
            class="opacity-50 items-center justify-between border-1 border-solid border-gray relative text-base rounded-sm bg-white shadow-sm pointer-events-auto flex shrink-0 items-start gap-2 p-4 w-20rem max-w-[calc(100vw-2rem)] overflow-hidden"
          >
            <div>
              <h2>{{ item.meta.title }}</h2>
              <p>{{ item.meta.body }}</p>
            </div>

            <button @pointerdown="dismiss(item.uuid)" aria-label="close">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="gray"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </VNotification>
        </TransitionGroup>
      </VNotificationProvider>
    </Teleport>
  </main>
</template>
