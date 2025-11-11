import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import './style.css' // This should import Tailwind CSS

// Initialize stores
const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

// Initialize stores after app is mounted
import { useAppStore } from './stores/app'
import { useContractStore } from './stores/contracts'

const initializeStores = async () => {
  const appStore = useAppStore()
  const contractStore = useContractStore()

  await appStore.initialize()
  await contractStore.initialize()
}

// Initialize stores but don't block app startup
initializeStores().catch((error) => {
  console.error('Failed to initialize stores:', error)
})