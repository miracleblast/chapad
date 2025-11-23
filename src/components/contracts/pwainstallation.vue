<template>
  <div v-if="showPrompt" class="pwa-install-prompt fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 animate-slide-up">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-r from-chapa-purple-500 to-chapa-orange-500 rounded-full flex items-center justify-center">
          <Icon icon="noto:bird" class="text-white text-lg" />
        </div>
        <div>
          <h4 class="font-semibold text-gray-800 dark:text-white">Install ChapaDocs</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">For better experience</p>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button @click="dismissPrompt" class="btn-ghost text-sm px-3 py-2">
          Later
        </button>
        <button @click="installApp" class="btn-primary text-sm px-3 py-2">
          Install
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted } from 'vue'

const showPrompt = ref(false)
let deferredPrompt: any = null

const installApp = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User installed the app')
        localStorage.setItem('pwaInstallDismissed', 'true')
      }
      deferredPrompt = null
    })
  }
}

const dismissPrompt = () => {
  showPrompt.value = false
  localStorage.setItem('pwaPromptDismissed', 'true')
}

const isAppInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true
}

onMounted(() => {
  // Check if already installed
  if (isAppInstalled()) {
    return
  }

  // Check if user dismissed previously
  const dismissed = localStorage.getItem('pwaPromptDismissed')
  const installed = localStorage.getItem('pwaInstallDismissed')
  
  if (dismissed || installed) {
    return
  }

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showPrompt.value = true
  })

  // Show prompt after delay if not triggered by browser
  setTimeout(() => {
    if (!showPrompt.value && !isAppInstalled()) {
      showPrompt.value = true
    }
  }, 5000)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', () => {})
})
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>