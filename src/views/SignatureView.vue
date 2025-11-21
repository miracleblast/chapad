<template>
  <div class="min-h-screen bg-chapa-sand-50 dark:bg-gray-900 pb-20">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-cal text-chapa-purple-600 dark:text-chapa-purple-300 mb-1">
              Sign Contract
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-poppins">
              {{ contract?.title || 'Loading...' }}
            </p>
          </div>
          <button @click="closeSignature" class="btn-ghost p-2">
            <Icon icon="material-symbols:close" class="text-xl" />
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <!-- Contract Info -->
      <div class="chapa-glass-card p-5 mb-6">
        <div class="flex items-center space-x-3 mb-4">
          <Icon :icon="getContractIcon(contract?.type)" class="text-2xl text-chapa-purple-500" />
          <div>
            <h3 class="font-semibold text-gray-800 dark:text-white font-poppins">
              {{ contract?.title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {{ contract?.type }} Agreement
            </p>
          </div>
        </div>

        <!-- Enhanced Signing Progress -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Your Signature</span>
            <span v-if="userSignature" class="flex items-center space-x-1 text-green-500 text-sm">
              <Icon icon="material-symbols:check-circle" />
              <span>Signed</span>
            </span>
            <span v-else class="text-orange-500 text-sm">Pending</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ otherPartyName }}</span>
            <span v-if="otherPartySignature" class="flex items-center space-x-1 text-green-500 text-sm">
              <Icon icon="material-symbols:check-circle" />
              <span>Signed</span>
            </span>
            <span v-else class="text-gray-400 text-sm">Waiting</span>
          </div>
        </div>

        <!-- Share Instructions (NEW) -->
        <div v-if="userSignature && !otherPartySignature" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div class="flex items-start space-x-2">
            <Icon icon="material-symbols:share" class="text-blue-500 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                Share with Counterparty
              </p>
              <p class="text-xs text-blue-700 dark:text-blue-400">
                Send this contract to <strong>{{ contract?.parties.secondParty.name }}</strong> for their signature
              </p>
              <button @click="shareContract" class="btn-primary text-xs mt-2 px-3 py-1">
                <Icon icon="material-symbols:share" class="text-sm mr-1" />
                Share Contract
              </button>
            </div>
          </div>
        </div>

        <!-- Fully Signed Celebration (NEW) -->
        <div v-if="userSignature && otherPartySignature" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <Icon icon="material-symbols:celebration" />
            <span class="font-medium">Contract Fully Executed!</span>
          </div>
        </div>
      </div>

      <!-- Signature Pad -->
      <div v-if="!userSignature" class="chapa-glass-card p-5 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
          Add Your Signature
        </h3>
        
        <SignaturePad 
          @saved="handleSignatureSaved"
          @cancel="closeSignature"
        />
      </div>

      <!-- Signature Preview -->
      <div v-if="userSignature" class="chapa-glass-card p-5">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
          Signature Preview
        </h3>
        
        <div class="flex items-center justify-center p-6 border-2 border-dashed border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
          <div v-if="userSignature.type === 'text'" class="text-center">
            <div class="text-3xl font-signature mb-2" :style="{ fontFamily: getSignatureFont(userSignature.data), color: userSignature.color }">
              {{ userSignature.data }}
            </div>
            <p class="text-sm text-green-600 dark:text-green-400">Text Signature</p>
          </div>
          
          <div v-else-if="userSignature.type === 'draw' || userSignature.type === 'image'" class="text-center">
            <img :src="userSignature.data" alt="Signature" class="max-h-20 mx-auto mb-2" />
            <p class="text-sm text-green-600 dark:text-green-400">
              {{ userSignature.type === 'draw' ? 'Drawn Signature' : 'Uploaded Signature' }}
            </p>
          </div>
        </div>

        <div class="flex space-x-3 mt-4">
          <button @click="userSignature = null" class="btn-secondary flex-1">
            Change Signature
          </button>
          <button @click="finalizeSignature" class="btn-primary flex-1">
            Confirm & Save
          </button>
        </div>
      </div>

      <!-- Contract Terms Preview -->
      <div class="chapa-glass-card p-5">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
          Contract Summary
        </h3>
        
        <div class="prose prose-sm dark:prose-invert max-w-none">
          <div class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p><strong>Parties:</strong> {{ contract?.parties.firstParty.name }} & {{ contract?.parties.secondParty.name }}</p>
            <p><strong>Jurisdiction:</strong> {{ getCountryName(contract?.jurisdiction.firstCountry) }} / {{ getCountryName(contract?.jurisdiction.secondCountry) }}</p>
            <p><strong>Currency:</strong> {{ contract?.jurisdiction.currency }}</p>
            <p><strong>Created:</strong> {{ formatDate(contract?.createdAt) }}</p>
          </div>
          
          <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-40 overflow-y-auto">
            <pre class="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{{ contract?.terms }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useContractStore } from '@/stores/contracts'
import SignaturePad from '@/components/ui/SignaturePad.vue'
import type { Contract } from '@/utils/contracts'

const router = useRouter()
const route = useRoute()
const contractStore = useContractStore()

// State
const contract = ref<Contract | null>(null)
const userSignature = ref<any>(null)

// Computed
const otherPartyName = computed(() => {
  if (!contract.value) return ''
  // Assuming user is firstParty - in real app, you'd have user authentication
  return contract.value.parties.secondParty.name
})

const otherPartySignature = computed(() => {
  return contract.value?.signatures.secondParty
})

// Methods
const getContractIcon = (type?: string) => {
  const icons: { [key: string]: string } = {
    debt: 'material-symbols:money',
    sales: 'material-symbols:shopping-cart',
    service: 'material-symbols:design-services',
    partnership: 'material-symbols:handshake',
    'import-export': 'material-symbols:airport-shuttle',
    employment: 'material-symbols:work',
    nda: 'material-symbols:lock',
    custom: 'material-symbols:description'
  }
  return icons[type || 'custom'] || 'material-symbols:description'
}

// ENHANCED: More font options for text signatures
const getSignatureFont = (signatureText: string) => {
  const fonts = [
    'cursive', 
    '"Dancing Script", cursive', 
    '"Great Vibes", cursive', 
    '"Parisienne", cursive', 
    '"Sacramento", cursive',
    '"Clicker Script", cursive'
  ]
  return fonts[signatureText.length % fonts.length]
}

const getCountryName = (countryCode?: string) => {
  if (!countryCode) return 'Unknown'
  const countries: { [key: string]: string } = {
    NG: 'Nigeria', KE: 'Kenya', GH: 'Ghana', ZA: 'South Africa',
    EG: 'Egypt', TD: 'Chad', CN: 'China', IN: 'India', RU: 'Russia'
  }
  return countries[countryCode] || countryCode
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}

const handleSignatureSaved = (signatureData: any) => {
  userSignature.value = signatureData
}

// ENHANCED: Better success notification
const finalizeSignature = async () => {
  if (!contract.value || !userSignature.value) return

  try {
    // In production, this would be firstParty or secondParty based on user role
    const party: 'firstParty' | 'secondParty' = 'firstParty'
    
    await contractStore.addSignature(contract.value.id, userSignature.value, party)
    
    // Enhanced notification
    showNotification('Signature saved successfully!', 'success')
    
    // If both parties signed, show celebration
    if (otherPartySignature.value) {
      setTimeout(() => {
        showNotification('Contract fully executed! 🎉', 'success')
      }, 1000)
    }
    
  } catch (error) {
    showNotification('Failed to save signature. Please try again.', 'error')
  }
}

// NEW: Share contract functionality
const shareContract = () => {
  // In a real app, this would generate a shareable link or send an email
  showNotification('Share feature coming soon!', 'info')
}

// NEW: Enhanced notification system
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // Create notification element
  const notification = document.createElement('div')
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  
  notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg font-poppins text-sm transition-all duration-300`
  notification.textContent = message
  notification.style.opacity = '0'
  notification.style.transform = 'translateX(-50%) translateY(-20px)'
  
  document.body.appendChild(notification)
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1'
    notification.style.transform = 'translateX(-50%) translateY(0)'
  }, 100)
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0'
    notification.style.transform = 'translateX(-50%) translateY(-20px)'
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

const closeSignature = () => {
  router.push('/documents')
}

// Load contract data
onMounted(async () => {
  const contractId = route.query.contractId as string
  if (contractId) {
    try {
      const contractData = await contractStore.getContractById(contractId)
      if (contractData) {
        contract.value = contractData
        
        // Check if user already signed
        if (contractData.signatures.firstParty) {
          userSignature.value = {
            type: 'image', // Assume image for existing signatures
            data: contractData.signatures.firstParty.signature
          }
        }
      }
    } catch (error) {
      showNotification('Failed to load contract', 'error')
      closeSignature()
    }
  } else {
    showNotification('No contract specified', 'error')
    closeSignature()
  }
})
</script>

<style scoped>
.prose {
  max-width: none;
}

.font-signature {
  font-family: cursive, 'Dancing Script', 'Great Vibes', 'Parisienne', 'Sacramento', 'Clicker Script', sans-serif;
}
</style>