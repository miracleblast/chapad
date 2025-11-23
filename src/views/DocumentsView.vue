<template>
  <div class="min-h-screen bg-chapa-sand-50 dark:bg-gray-900 pb-20">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-xl font-cal text-chapa-purple-600 dark:text-chapa-purple-300 mb-1">
          My Documents
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-poppins">
          {{ totalContracts }} contracts · {{ activeContracts }} active
        </p>
      </div>
    </div>
<!-- Add this in the header section of DocumentsView.vue -->
<div class="container mx-auto px-4 py-4">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-cal text-chapa-purple-600 dark:text-chapa-purple-300 mb-1">
        My Documents
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 font-poppins">
        {{ totalContracts }} contracts · {{ activeContracts }} active
        <span class="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          ID: {{ currentUserId }}
        </span>
      </p>
    </div>
  </div>
</div>
    <!-- Filter Tabs -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4">
        <div class="flex space-x-4 overflow-x-auto py-3">
          <button
            v-for="filter in filters"
            :key="filter.id"
            @click="activeFilter = filter.id"
            class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
            :class="activeFilter === filter.id
              ? 'bg-chapa-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            {{ filter.name }} ({{ getFilterCount(filter.id) }})
          </button>
        </div>
      </div>
    </div>
<!-- Add this to your contract menu in DocumentsView.vue -->
<button @click="saveToCloud(selectedContract, 'google')" 
  class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
  <Icon icon="logos:google-drive" class="text-xl" />
  <span class="font-poppins">Save to Google Drive</span>
</button>

<button @click="saveToCloud(selectedContract, 'onedrive')" 
  class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
  <Icon icon="simple-icons:microsoftonedrive" class="text-xl text-blue-500" />
  <span class="font-poppins">Save to OneDrive</span>
</button>
    <!-- Documents List -->
    <div class="container mx-auto px-4 py-6">
      <!-- Loading State -->
      <div v-if="contractStore.isLoading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="chapa-glass-card p-5 animate-pulse">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredContracts.length === 0" class="text-center py-12">
        <Icon icon="material-symbols:folder-off" class="text-6xl text-gray-300 dark:text-gray-600 mb-4 mx-auto" />
        <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2 font-poppins">
          No contracts found
        </h3>
        <p class="text-gray-500 dark:text-gray-500 text-sm mb-6">
          {{ getEmptyStateMessage() }}
        </p>
        <RouterLink to="/" class="btn-primary inline-flex items-center space-x-2">
          <Icon icon="material-symbols:add" />
          <span>Create First Contract</span>
        </RouterLink>
      </div>

      <!-- Contracts List -->
      <div v-else class="space-y-4">
        <div
          v-for="contract in filteredContracts"
          :key="contract.id"
          class="chapa-glass-card p-5 card-hover"
          @click="viewContract(contract)"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="getStatusColor(contract.status).bg">
                <Icon :icon="getContractIcon(contract.type)" 
                  :class="getStatusColor(contract.status).text" class="text-lg" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm line-clamp-1">
                  {{ contract.title }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {{ contract.type }} · {{ formatDate(contract.updatedAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusColor(contract.status).badge">
                {{ contract.status }}
              </span>
              <Icon icon="material-symbols:chevron-right" class="text-gray-400" />
            </div>
          </div>

          <!-- Parties -->
          <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
            <span class="truncate">{{ contract.parties.firstParty.name }}</span>
            <Icon icon="material-symbols:swap-horiz" class="text-gray-400 mx-2" />
            <span class="truncate">{{ contract.parties.secondParty.name }}</span>
          </div>

          <!-- Progress & Actions -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-4 text-xs">
              <span class="flex items-center space-x-1"
                :class="contract.signatures.firstParty ? 'text-green-500' : 'text-gray-400'">
                <Icon icon="material-symbols:check-circle" class="text-sm" />
                <span>Party 1</span>
              </span>
              <span class="flex items-center space-x-1"
                :class="contract.signatures.secondParty ? 'text-green-500' : 'text-gray-400'">
                <Icon icon="material-symbols:check-circle" class="text-sm" />
                <span>Party 2</span>
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button @click.stop="downloadContract(contract)" 
                class="p-2 text-gray-400 hover:text-chapa-purple-500 transition-colors">
                <Icon icon="material-symbols:download" class="text-lg" />
              </button>
              <button @click.stop="showContractMenu(contract)" 
                class="p-2 text-gray-400 hover:text-chapa-purple-500 transition-colors">
                <Icon icon="material-symbols:more-vert" class="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <RouterLink to="/" 
      class="fixed bottom-24 right-4 w-14 h-14 bg-chapa-purple-500 hover:bg-chapa-purple-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-chapa-purple-500/25 transition-all duration-300 hover:scale-110">
      <Icon icon="material-symbols:add" class="text-2xl" />
    </RouterLink>

    <!-- Contract Menu Modal -->
    <div v-if="selectedContract" class="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-md max-h-80 overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
            {{ selectedContract.title }}
          </h3>
          <div class="space-y-2">
            <button @click="editContract(selectedContract)" 
              class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Icon icon="material-symbols:edit" class="text-chapa-purple-500 text-xl" />
              <span class="font-poppins">Edit Contract</span>
            </button>
            <button @click="duplicateContract(selectedContract)" 
              class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Icon icon="material-symbols:content-copy" class="text-chapa-purple-500 text-xl" />
              <span class="font-poppins">Duplicate</span>
            </button>
            <button @click="shareContract(selectedContract)" 
              class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Icon icon="material-symbols:share" class="text-chapa-purple-500 text-xl" />
              <span class="font-poppins">Share</span>
            </button>
            <button @click="deleteContract(selectedContract)" 
              class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
              <Icon icon="material-symbols:delete" class="text-xl" />
              <span class="font-poppins">Delete</span>
            </button>
          </div>
          <button @click="selectedContract = null" 
            class="w-full mt-4 py-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useContractStore } from '@/stores/contracts'
import { computed, ref, onMounted } from 'vue'
import type { Contract } from '@/utils/contracts'
import { CloudStorageManager } from '@/engine/CloudStorageManager'

const router = useRouter()
const contractStore = useContractStore()

// State
const activeFilter = ref('all')
const selectedContract = ref<Contract | null>(null)

// Filters
const filters = [
  { id: 'all', name: 'All Contracts' },
  { id: 'draft', name: 'Drafts' },
  { id: 'active', name: 'Active' },
  { id: 'completed', name: 'Completed' },
  { id: 'signed', name: 'Signed' }
]

// Computed
// In DocumentsView.vue script
const currentUserId = computed(() => {
  const license = UniversalLicenseManager.getStoredLicense('chapadocs')
  return license?.id ? license.id.substring(0, 8) + '...' : 'No ID'
})
const totalContracts = computed(() => contractStore.contracts.length)
const activeContracts = computed(() => contractStore.activeContracts.length)

const filteredContracts = computed(() => {
  const contracts = contractStore.contracts
  
  switch (activeFilter.value) {
    case 'draft':
      return contracts.filter(c => c.status === 'draft')
    case 'active':
      return contracts.filter(c => c.status === 'active')
    case 'completed':
      return contracts.filter(c => c.status === 'completed')
    case 'signed':
      return contracts.filter(c => c.signatures.firstParty && c.signatures.secondParty)
    default:
      return contracts
  }
})

// Methods
const getFilterCount = (filterId: string) => {
  const contracts = contractStore.contracts
  switch (filterId) {
    case 'all': return contracts.length
    case 'draft': return contracts.filter(c => c.status === 'draft').length
    case 'active': return contracts.filter(c => c.status === 'active').length
    case 'completed': return contracts.filter(c => c.status === 'completed').length
    case 'signed': return contracts.filter(c => c.signatures.firstParty && c.signatures.secondParty).length
    default: return 0
  }
}

const getEmptyStateMessage = () => {
  switch (activeFilter.value) {
    case 'draft': return "You don't have any draft contracts"
    case 'active': return "No active contracts at the moment"
    case 'completed': return "No completed contracts yet"
    case 'signed': return "No fully signed contracts"
    default: return "Create your first contract to get started"
  }
}

const getContractIcon = (type: string) => {
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
  return icons[type] || 'material-symbols:description'
}

const getStatusColor = (status: string) => {
  const colors: { [key: string]: { bg: string; text: string; badge: string } } = {
    draft: { 
      bg: 'bg-gray-100 dark:bg-gray-700', 
      text: 'text-gray-500', 
      badge: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' 
    },
    active: { 
      bg: 'bg-green-100 dark:bg-green-900', 
      text: 'text-green-500', 
      badge: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
    },
    completed: { 
      bg: 'bg-blue-100 dark:bg-blue-900', 
      text: 'text-blue-500', 
      badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
    },
    cancelled: { 
      bg: 'bg-red-100 dark:bg-red-900', 
      text: 'text-red-500', 
      badge: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
    }
  }
  return colors[status] || colors.draft
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString()
}

const viewContract = (contract: Contract) => {
  router.push(`/builder?edit=${contract.id}`)
}

const showContractMenu = (contract: Contract) => {
  selectedContract.value = contract
}

const editContract = (contract: Contract) => {
  router.push(`/builder?edit=${contract.id}`)
  selectedContract.value = null
}

const duplicateContract = async (contract: Contract) => {
  try {
    const newContract = { ...contract }
    newContract.id = ''
    newContract.title = `${contract.title} (Copy)`
    newContract.status = 'draft'
    newContract.createdAt = new Date().toISOString()
    newContract.updatedAt = new Date().toISOString()
    newContract.signatures = {}
    
    await contractStore.createContract(newContract)
    selectedContract.value = null
  } catch (error) {
    alert('Failed to duplicate contract')
  }
}

const shareContract = (contract: Contract) => {
  // Simple share implementation - can be enhanced with actual sharing
  const contractUrl = `${window.location.origin}/builder?view=${contract.id}`
  if (navigator.share) {
    navigator.share({
      title: contract.title,
      text: `Check out this contract: ${contract.title}`,
      url: contractUrl
    })
  } else {
    navigator.clipboard.writeText(contractUrl)
    alert('Contract link copied to clipboard!')
  }
  selectedContract.value = null
}

const deleteContract = async (contract: Contract) => {
  if (confirm(`Are you sure you want to delete "${contract.title}"?`)) {
    try {
      await contractStore.deleteContract(contract.id)
      selectedContract.value = null
    } catch (error) {
      alert('Failed to delete contract')
    }
  }
}

const downloadContract = (contract: Contract) => {
  // Basic download implementation - will be enhanced with PDF generation
  const contractText = `
CONTRACT: ${contract.title}
Parties: ${contract.parties.firstParty.name} & ${contract.parties.secondParty.name}
Type: ${contract.type}
Status: ${contract.status}
Created: ${new Date(contract.createdAt).toLocaleDateString()}

${contract.terms}
  `.trim()

  const blob = new Blob([contractText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${contract.slug || contract.title}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
const saveToCloud = async (contract: Contract, provider: 'google' | 'onedrive') => {
  try {
    if (provider === 'google') {
      await CloudStorageManager.saveToGoogleDrive(contract)
    } else {
      await CloudStorageManager.saveToOneDrive(contract)
    }
    // Notification is handled by CloudStorageManager
  } catch (error) {
    // Error notification is handled by CloudStorageManager
  }
}
// Lifecycle
onMounted(async () => {
  if (contractStore.contracts.length === 0) {
    await contractStore.initialize()
  }
})
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>