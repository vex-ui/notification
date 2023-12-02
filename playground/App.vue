<script setup lang="ts">
// import { onMounted } from 'vue'
import { useNotification } from '../src/components'
import VNotificationProvider from '../src/components/VNotificationProvider.vue'
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
  <main>
    <button @click="send">notify</button>
    <!-- <TransitionDemo /> -->
    <VNotificationProvider />
  </main>
</template>
