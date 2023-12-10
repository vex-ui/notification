import { createApp } from 'vue'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import { plugin } from '../src/components'

const app = createApp(App)
app.use(plugin, {})
app.mount('#app')
