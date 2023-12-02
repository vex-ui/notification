<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotification } from '../src/components'
import VNotificationProvider from '../src/components/VNotificationProvider.vue'

const { notify, clearAllNotification } = useNotification()

const send = () => {
  notify({
    title: 'title',
    body: 'body',
    duration: 1000,
  })
}
</script>

<template>
  <main>
    <button @click="send">notify</button>
    <VNotificationProvider />
  </main>
</template>
