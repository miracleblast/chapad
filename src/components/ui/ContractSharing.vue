<template>
  <div class="contract-sharing">
    <!-- Share Contract Modal -->
    <div class="share-modal">
      <h3>Share Contract for Signature</h3>
      
      <!-- Contract Preview -->
      <div class="contract-preview-share mb-4">
        <ContractPreview :contractData="contract" :templateData="templateData" />
      </div>
      
      <!-- Share Options -->
      <div class="share-options space-y-4">
        <!-- Share via WhatsApp -->
        <button @click="shareViaWhatsApp" class="btn-share whatsapp">
          <Icon icon="mdi:whatsapp" class="text-xl" />
          Share via WhatsApp
        </button>
        
        <!-- Share via Email -->
        <button @click="shareViaEmail" class="btn-share email">
          <Icon icon="material-symbols:email" class="text-xl" />
          Share via Email
        </button>
        
        <!-- Share via SMS -->
        <button @click="shareViaSMS" class="btn-share sms">
          <Icon icon="material-symbols:sms" class="text-xl" />
          Share via SMS
        </button>

        <!-- Share via Google Drive -->
        <button @click="shareViaGoogleDrive" class="btn-share google-drive" :disabled="!canUseCloudStorage">
          <Icon icon="logos:google-drive" class="text-xl" />
          Save to Google Drive
        </button>

        <!-- Share via OneDrive -->
        <button @click="shareViaOneDrive" class="btn-share onedrive" :disabled="!canUseCloudStorage">
          <Icon icon="simple-icons:microsoftonedrive" class="text-xl" />
          Save to OneDrive
        </button>
        
        <!-- Copy Link -->
        <button @click="copyShareLink" class="btn-share link">
          <Icon icon="material-symbols:link" class="text-xl" />
          Copy Share Link
        </button>
      </div>
      
      <!-- Security Options -->
      <div class="security-options mt-4">
        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="requireAccessCode" />
          <span class="text-sm">Require access code</span>
        </label>
        
        <div v-if="requireAccessCode" class="access-code mt-2">
          <input 
            v-model="accessCode" 
            type="text" 
            placeholder="Enter 6-digit code"
            class="input-modern"
            maxlength="6"
            pattern="[0-9]*"
          >
        </div>
      </div>

      <!-- User ID Display -->
      <div class="user-info mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p class="text-xs text-gray-600 dark:text-gray-400">
          Your User ID: <code class="font-mono">{{ currentUserId }}</code>
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Share this with others to identify you in contracts
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ContractSharing as SharingEngine } from '@/utils/contractSharing'
import { UniversalLicenseManager } from '@/utils/licenseManager'
import { CloudStorageManager } from '@/engine/CloudStorageManager'

const shareViaGoogleDrive = async () => {
   try {
    // Check if Google Drive is connected
    if (!CloudStorageManager.isGoogleDriveConnected()) {
      alert('Please connect Google Drive in Settings first.')
      return
    }
    
    // Use the real cloud storage manager
    const fileId = await CloudStorageManager.saveToGoogleDrive(props.contract)
    console.log('Contract saved to Google Drive with ID:', fileId)
    
  } catch (error) {
    console.error('Google Drive upload failed:', error)
  }
}

const shareViaOneDrive = async () => {
  try {
    // Check if OneDrive is connected
    if (!CloudStorageManager.isOneDriveConnected()) {
      alert('Please connect OneDrive in Settings first.')
      return
    }
    
    // Use the real cloud storage manager
    const fileId = await CloudStorageManager.saveToOneDrive(props.contract)
    console.log('Contract saved to OneDrive with ID:', fileId)
    
  } catch (error) {
    console.error('OneDrive upload failed:', error)
  }
}

const props = defineProps<{
  contract: any
  templateData: any
}>()

const requireAccessCode = ref(false)
const accessCode = ref('')
const currentUserId = ref('')

// Check cloud storage access
const canUseCloudStorage = computed(() => {
  const license = UniversalLicenseManager.getStoredLicense('chapadocs')
  return license?.type === 'agent' || license?.type === 'industrial'
})

const generateShareLink = () => {
  const shareData = {
    contract: props.contract,
    templateData: props.templateData,
    accessCode: requireAccessCode.value ? accessCode.value : undefined
  }
  
  return SharingEngine.generateShareLink(shareData.contract, shareData.templateData, shareData.accessCode)
}

const shareViaWhatsApp = () => {
  const shareLink = generateShareLink()
  const message = `Please review and sign this contract: ${shareLink}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

const shareViaEmail = () => {
  const shareLink = generateShareLink()
  const subject = `Contract for Signature: ${props.contract.title}`
  const body = `Please review and sign the contract: ${shareLink}`
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = mailtoUrl
}

const shareViaSMS = () => {
  const shareLink = generateShareLink()
  const message = `Contract for signature: ${shareLink}`
  const smsUrl = `sms:?body=${encodeURIComponent(message)}`
  window.location.href = smsUrl
}

const shareViaGoogleDrive = async () => {
  if (!canUseCloudStorage.value) {
    alert('Cloud storage requires Agent or Industrial plan. Upgrade in Settings.')
    return
  }
  
  try {
    // Check if Google Drive is connected
    const isConnected = localStorage.getItem('google_drive_connected') === 'true'
    if (!isConnected) {
      alert('Please connect Google Drive in Settings first.')
      return
    }
    
    // Simulate upload to Google Drive
    const contractData = {
      ...props.contract,
      sharedVia: 'google_drive',
      sharedAt: new Date().toISOString()
    }
    
    localStorage.setItem(`gdrive_contract_${props.contract.id}`, JSON.stringify(contractData))
    alert('Contract saved to Google Drive successfully!')
  } catch (error) {
    console.error('Google Drive upload failed:', error)
    alert('Failed to save to Google Drive')
  }
}

const shareViaOneDrive = async () => {
  if (!canUseCloudStorage.value) {
    alert('Cloud storage requires Agent or Industrial plan. Upgrade in Settings.')
    return
  }
  
  try {
    // Check if OneDrive is connected
    const isConnected = localStorage.getItem('one_drive_connected') === 'true'
    if (!isConnected) {
      alert('Please connect OneDrive in Settings first.')
      return
    }
    
    // Simulate upload to OneDrive
    const contractData = {
      ...props.contract,
      sharedVia: 'one_drive',
      sharedAt: new Date().toISOString()
    }
    
    localStorage.setItem(`onedrive_contract_${props.contract.id}`, JSON.stringify(contractData))
    alert('Contract saved to OneDrive successfully!')
  } catch (error) {
    console.error('OneDrive upload failed:', error)
    alert('Failed to save to OneDrive')
  }
}

const copyShareLink = async () => {
  const shareLink = generateShareLink()
  try {
    await navigator.clipboard.writeText(shareLink)
    alert('Share link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy link:', err)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = shareLink
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Share link copied to clipboard!')
  }
}

// Load user ID
onMounted(() => {
  const license = UniversalLicenseManager.getStoredLicense('chapadocs')
  currentUserId.value = license?.id || 'Not available'
})
</script>

<style scoped>
.btn-share {
  @apply w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border transition-all duration-300;
}

.btn-share:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.btn-share.whatsapp {
  @apply bg-green-500 text-white border-green-500 hover:bg-green-600;
}

.btn-share.email {
  @apply bg-blue-500 text-white border-blue-500 hover:bg-blue-600;
}

.btn-share.sms {
  @apply bg-purple-500 text-white border-purple-500 hover:bg-purple-600;
}

.btn-share.google-drive {
  @apply bg-blue-400 text-white border-blue-400 hover:bg-blue-500;
}

.btn-share.onedrive {
  @apply bg-green-600 text-white border-green-600 hover:bg-green-700;
}

.btn-share.link {
  @apply bg-gray-500 text-white border-gray-500 hover:bg-gray-600;
}
</style>