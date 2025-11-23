<template>
  <div class="min-h-screen bg-chapa-sand-50 dark:bg-gray-900 safe-top safe-bottom">
    <!-- PWA Installation Prompt -->
    <PWAInstallPrompt />
    
    <div class="container mx-auto px-4 py-8">
      <!-- Access Code Check -->
      <div v-if="requiresAccessCode && !accessGranted" class="access-code-check">
        <div class="chapa-glass-card p-6 max-w-md mx-auto">
          <Icon icon="material-symbols:lock" class="text-3xl text-chapa-purple-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-center mb-4">Enter Access Code</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
            This contract requires an access code to view
          </p>
          <input 
            v-model="enteredCode"
            type="text" 
            placeholder="Enter 6-digit code"
            class="input-modern w-full mb-4 text-center text-lg"
            maxlength="6"
            pattern="[0-9]*"
            inputmode="numeric"
          >
          <button @click="verifyAccessCode" class="btn-primary w-full">
            View Contract
          </button>
        </div>
      </div>
      
      <!-- Contract Preview -->
      <div v-else-if="sharedContract" class="contract-preview-section">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-cal text-chapa-purple-600 dark:text-chapa-purple-300 mb-2">
            Contract Shared with You
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Please review the contract below before signing
          </p>
        </div>
        
        <ContractPreview 
          :contractData="sharedContract.contractData" 
          :templateData="sharedContract.templateData" 
        />
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button @click="openInApp" class="btn-primary flex items-center justify-center space-x-2">
            <Icon icon="material-symbols:open-in-new" />
            <span>Open in ChapaDocs to Sign</span>
          </button>
          
          <button @click="installApp" class="btn-secondary flex items-center justify-center space-x-2">
            <Icon icon="material-symbols:install-desktop" />
            <span>Install ChapaDocs</span>
          </button>
        </div>

        <!-- Quick Sign Option (NEW) -->
        <div v-if="!sharedContract.isSigned" class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
            <Icon icon="material-symbols:bolt" />
            <span class="font-semibold">Quick Sign</span>
          </div>
          <p class="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Sign this contract directly without installing the app
          </p>
          <button @click="quickSign" class="btn-accent w-full">
            Sign Now
          </button>
        </div>
      </div>
      
      <!-- Invalid Link -->
      <div v-else class="text-center py-12">
        <Icon icon="material-symbols:error" class="text-6xl text-red-500 mb-4" />
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Invalid or Expired Link
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          This contract link is no longer available or has been removed.
        </p>
        <button @click="goHome" class="btn-primary">
          Go to Homepage
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PWAInstallPrompt from './pwainstallation.vue'
import ContractPreview from './ContractPreview.vue'
import { ContractSharing } from '@/utils/contractSharing'

const route = useRoute()
const router = useRouter()
const shareId = route.params.shareId as string

const sharedContract = ref<any>(null)
const requiresAccessCode = ref(false)
const accessGranted = ref(false)
const enteredCode = ref('')

const loadSharedContract = async (id: string) => {
  return ContractSharing.getSharedContract(id)
}

const verifyAccessCode = () => {
  if (ContractSharing.verifyAccessCode(shareId, enteredCode.value)) {
    accessGranted.value = true
  } else {
    alert('Invalid access code. Please try again.')
  }
}

const openInApp = () => {
  // Deep link to open in ChapaDocs app
  const appUrl = `chapadocs://sign-contract/${shareId}`
  window.location.href = appUrl
  
  // Fallback: redirect to signature page after delay
  setTimeout(() => {
    router.push(`/sign-contract/${shareId}`)
  }, 1000)
}

const quickSign = () => {
  router.push(`/sign-contract/${shareId}`)
}

const installApp = () => {
  // This will trigger the PWA install prompt
  window.dispatchEvent(new CustomEvent('trigger-pwa-install'))
}

const goHome = () => {
  router.push('/')
}

onMounted(async () => {
  const contractData = await loadSharedContract(shareId)
  
  if (contractData) {
    sharedContract.value = contractData
    requiresAccessCode.value = !!contractData.accessCode
    accessGranted.value = !requiresAccessCode.value
  }
})
</script>