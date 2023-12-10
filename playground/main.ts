import { createApp } from 'vue'
import App from './App.vue'
import { plugin } from '../src/plugin'

const app = createApp(App)
app.use(plugin, {})
app.mount('#app')
