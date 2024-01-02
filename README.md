# Vex Toast

this is a small unstyled toast service library for Vue 3.

## installation

```sh
pnpm i @vex-ui/toast
```

## usage

1. register the plugin in your app.

```ts
import { createApp } from 'vue'
import VexPlugin from '@vex/toast'

const app = createApp()
app.use(VexPlugin, {})
app.mount()
```

2. use the `useToast` composable to access the `toastify` and `toasts` data,
   then use the `Toast` and `ToastProvider` components to display the toasts, use `dismiss` function to dismiss them.

```tsx
import { useToast } from '@vex/toast'
const { toastify, toasts, dismiss } = useToast()

<template>
  <ToastProvider>
    <Toast
      @timer-end="dismiss(item.uuid)"
      v-for="item in toasts"
      v-bind="item"
      :key="item.uuid"
    />
  </ToastProvider>
</template>
```

3. use the `toastify` function to display a toast.

```tsx
import { useToast } from '@vex/toast'
const { toastify, toasts } = useToast()

// anything you pass on the first argument will be available inside item.meta in the template.
toastify({ message: 'Hello!' }, { duration: 3000 })

<template>
  <ToastProvider>
    <Toast
      @timer-end="dismiss(item.uuid)"
      v-for="item in toasts"
      v-bind="item"
      :key="item.uuid"
    >
      <h2>{{ item.meta.message }}</h2>
    </Toast>
  </ToastProvider>
</template>
```
