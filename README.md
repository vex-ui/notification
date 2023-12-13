# Vex Notification

this is a small unstyled notification service library for Vue 3.

## installation

```sh
pnpm i @vex/notification
```

## usage

1. register the plugin in your app.

```ts
import { createApp } from 'vue'
import VexPlugin from '@vex/notification'

const app = createApp()
app.use(VexPlugin, {})
app.mount()
```

3. use the `useNotification` composable to access the `notify` and `notifications` data,
   then use the `Notification` component to display the notifications, and `dismiss` to dismiss them.

```vue
// App.vue import { useNotification } from '@vex/notification' const { notify, notifications,
dismiss } = useNotification()

<template>
  <NotificationProvider>
    <Notification
      @timer-end="dismiss(item.uuid)"
      v-for="item in notifications"
      v-bind="item"
      :key="item.uuid"
    />
  </NotificationProvider>
</template>
```

4. use the `notify` function to display a notification.

```ts
import { useNotification } from '@vex/notification'

const { notify } = useNotification()

notify({ message: 'Hello!' })
```
