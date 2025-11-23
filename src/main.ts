import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import './style.css'

// Import the new engine initializers
import { AppInitializer } from './engine/AppInitializer'

// Initialize stores
const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

// Initialize stores after app is mounted
import { useAppStore } from './stores/app'
import { useContractStore } from './stores/contracts'
import { useLicenseStore } from './stores/license'

const initializeStores = async () => {
  try {
    console.log('🔄 Initializing ChapaDocs systems...')
    
    // Step 1: Initialize new core engines (Storage, Cloud, Notifications)
    await AppInitializer.initialize()
    
    // Step 2: Initialize your existing Pinia stores
    const appStore = useAppStore()
    const contractStore = useContractStore()
    const licenseStore = useLicenseStore()

    await appStore.initialize()
    await contractStore.initialize()
    licenseStore.initialize()
    
    console.log('✅ All systems initialized successfully')
    
  } catch (error) {
    console.error('❌ Failed to initialize stores:', error)
  }
}

// Initialize everything but don't block app startup
initializeStores().catch((error) => {
  console.error('Critical initialization error:', error)
})