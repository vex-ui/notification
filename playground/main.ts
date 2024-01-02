import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import '@unocss/reset/tailwind.css'
import { VexToastPlugin } from '../src/plugin'

const app = createApp(App)
app.use(VexToastPlugin, {})
app.mount('#app')
