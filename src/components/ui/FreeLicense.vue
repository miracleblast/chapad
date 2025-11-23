<template>
  <div class="license-activation">
    <!-- Free License - Instant, No Data -->
    <div v-if="!userLicense" class="free-license-section">
      <div class="chapa-glass-card p-6 text-center">
        <Icon icon="material-symbols:key" class="text-4xl text-chapa-purple-500 mb-4" />
        <h3 class="text-xl font-cal text-gray-800 dark:text-white mb-2">
          Get Started Instantly
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Generate a free license key with zero personal data required
        </p>
        
        <button @click="generateFreeLicense" class="btn-primary w-full">
          Generate Free License
        </button>
        
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-3">
          No email, no tracking, complete privacy • 15 contracts/month
        </p>
      </div>
    </div>

    <!-- Active License Display -->
    <div v-else class="active-license">
      <div class="chapa-glass-card p-6">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3 text-green-500">
            <Icon icon="material-symbols:check-circle" class="text-2xl" />
            <span class="font-semibold">License Active</span>
          </div>
          <div class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
            {{ userLicense.type.toUpperCase() }}
          </div>
        </div>
        
        <div class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <div class="flex justify-between">
            <span class="font-medium">Key:</span>
            <span class="font-mono text-xs">{{ userLicense.key }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Expires:</span>
            <span>{{ formatDate(userLicense.expiresAt) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Contracts:</span>
            <span>{{ userLicense.contractsThisMonth }}/{{ userLicense.maxContracts }} this month</span>
          </div>
        </div>
        
        <div class="flex space-x-2 mt-4">
          <button @click="userLicense = null" class="btn-secondary flex-1 text-sm">
            Change License
          </button>
          <button v-if="userLicense.type === 'free'" @click="showUpgradeOptions" class="btn-primary flex-1 text-sm">
            Upgrade
          </button>
          <button v-else @click="renewLicense" class="btn-primary flex-1 text-sm">
            Renew
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { PrivacyFirstLicenseManager, MinimalLicense } from '@/utils/licenseManager'

const userLicense = ref<MinimalLicense | null>(null)

const generateFreeLicense = () => {
  const freeLicense = PrivacyFirstLicenseManager.generateFreeLicense()
  PrivacyFirstLicenseManager.saveLicense(freeLicense)
  userLicense.value = freeLicense
}

const showUpgradeOptions = () => {
  // Navigate to upgrade page
  window.dispatchEvent(new CustomEvent('show-upgrade-modal'))
}

const renewLicense = async () => {
  if (!userLicense.value) return
  
  try {
    const isValid = await PrivacyFirstLicenseManager.refreshLicenseFromServer(userLicense.value.key)
    if (isValid) {
      userLicense.value = PrivacyFirstLicenseManager.getStoredLicense()
      alert('License renewed successfully!')
    } else {
      alert('License renewal failed. Please check your payment.')
    }
  } catch (error) {
    alert('Renewal failed. Please try again.')
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  // Load existing license
  const savedLicense = PrivacyFirstLicenseManager.getStoredLicense()
  if (savedLicense) {
    userLicense.value = savedLicense
  }
})
</script>