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

2. use the `useNotification` composable to access the `notify` and `notifications` data,
   then use the `Notification` component to display the notifications, and `dismiss` to dismiss them.

```tsx
import { useNotification } from '@vex/notification'
const { notify, notifications, dismiss } = useNotification()

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

3. use the `notify` function to display a notification.

```tsx
import { useNotification } from '@vex/notification'
const { notify, notifications } = useNotification()

// anything you pass on the first argument will be available inside item.meta in the template.
notify({ message: 'Hello!' }, { duration: 3000 })

<template>
  <NotificationProvider>
    <Notification
      @timer-end="dismiss(item.uuid)"
      v-for="item in notifications"
      v-bind="item"
      :key="item.uuid"
    >
      <h2>{{ item.meta.message }}</h2>
    </Notification>
  </NotificationProvider>
</template>
```
