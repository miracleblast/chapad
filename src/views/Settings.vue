<template>
  <div class="min-h-screen bg-chapa-sand-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-cal text-chapa-purple-600 dark:text-chapa-purple-300 mb-2">Settings</h1>
        <p class="text-gray-600 dark:text-gray-300 font-poppins">Manage your ChapaDocs experience</p>
      </div>

      <!-- Settings Cards -->
      <div class="max-w-md mx-auto space-y-4">
        <!-- License & Authentication -->
        <div class="chapa-glass-card p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <Icon icon="material-symbols:lock" class="text-chapa-purple-500" />
            <span>License & Access</span>
          </h3>
          <div class="space-y-3">
            <div v-if="!isLicensed" class="text-center py-4">
              <Icon icon="material-symbols:lock-outline" class="text-4xl text-chapa-orange-500 mb-2" />
              <p class="text-gray-600 dark:text-gray-300 mb-4">Activate your license to access premium features</p>
              <button @click="showLicenseModal = true" class="btn-primary w-full">
                Activate License
              </button>
            </div>
            <div v-else class="space-y-2">
              <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div class="flex items-center space-x-2">
                  <Icon icon="material-symbols:check-circle" class="text-green-500 text-xl" />
                  <span class="text-green-700 dark:text-green-300 font-medium">License Active</span>
                </div>
                <span class="text-xs text-green-600 dark:text-green-400">Pro Plan</span>
              </div>
              <button @click="manageLicense" class="w-full btn-secondary">
                Manage License
              </button>
            </div>
          </div>
        </div>

        <!-- Language Settings -->
        <div class="chapa-glass-card p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <Icon icon="material-symbols:translate" class="text-chapa-purple-500" />
            <span>{{ $t('language') }}</span>
          </h3>
          <div class="space-y-3">
            <button 
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 border-2"
              :class="currentLanguage === lang.code 
                ? 'bg-chapa-purple-500 text-white border-chapa-purple-500 shadow-lg shadow-chapa-purple-500/25' 
                : 'bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600 hover:border-chapa-purple-300'"
            >
              <div class="flex items-center space-x-3">
                <Icon :icon="lang.flag" class="text-2xl" />
                <div class="text-left">
                  <div class="font-semibold font-poppins">{{ lang.name }}</div>
                  <div class="text-sm opacity-80">{{ lang.nativeName }}</div>
                </div>
              </div>
              <Icon 
                v-if="currentLanguage === lang.code"
                icon="material-symbols:check-circle" 
                class="text-xl" 
              />
            </button>
          </div>
        </div>

        <!-- Appearance -->
        <div class="chapa-glass-card p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <Icon icon="material-symbols:palette" class="text-chapa-purple-500" />
            <span>{{ $t('appearance') }}</span>
          </h3>
          <div class="space-y-3">
            <button 
              @click="toggleDarkMode"
              class="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 border-2"
              :class="isDarkMode 
                ? 'bg-gray-800 text-white border-gray-700 shadow-lg' 
                : 'bg-white text-gray-800 border-gray-200 shadow-lg shadow-chapa-purple-500/25'"
            >
              <span class="flex items-center space-x-3">
                <Icon :icon="isDarkMode ? 'material-symbols:dark-mode' : 'material-symbols:light-mode'" class="text-xl" />
                <span class="font-poppins">{{ isDarkMode ? $t('darkMode') : $t('lightMode') }}</span>
              </span>
              <div class="flex items-center space-x-2">
                <Icon :icon="isDarkMode ? 'material-symbols:night-sight-auto' : 'material-symbols:sunny'" class="text-lg" />
                <Icon v-if="!isDarkMode" icon="material-symbols:check-circle" class="text-white" />
              </div>
            </button>
          </div>
        </div>

        <!-- Document Settings -->
        <div class="chapa-glass-card p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <Icon icon="material-symbols:description" class="text-chapa-purple-500" />
            <span>Document Settings</span>
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <Icon icon="material-symbols:auto-awesome" class="text-chapa-purple-500 text-xl" />
                <div>
                  <div class="font-poppins font-medium">Auto Save</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Automatically save document changes</div>
                </div>
              </div>
              <button 
                @click="toggleAutoSave"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                :class="settings.autoSave ? 'bg-chapa-purple-500' : 'bg-gray-300 dark:bg-gray-600'"
              >
                <span 
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="settings.autoSave ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <Icon icon="material-symbols:cloud-download" class="text-chapa-purple-500 text-xl" />
                <div>
                  <div class="font-poppins font-medium">Auto Backup</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Backup documents to cloud</div>
                </div>
              </div>
              <button 
                @click="toggleAutoBackup"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                :class="settings.autoBackup ? 'bg-chapa-purple-500' : 'bg-gray-300 dark:bg-gray-600'"
              >
                <span 
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="settings.autoBackup ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Storage Management -->
        <div class="chapa-glass-card p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <Icon icon="material-symbols:database" class="text-chapa-purple-500" />
            <span>{{ $t('storage') }}</span>
          </h3>
          <div class="space-y-3">
            <!-- Storage Stats -->
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Contracts</span>
                <span class="text-chapa-purple-500 font-semibold">{{ contractsCount }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Templates</span>
                <span class="text-chapa-purple-500 font-semibold">{{ templatesCount }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Signatures</span>
                <span class="text-chapa-purple-500 font-semibold">{{ signaturesCount }}</span>
              </div>
              <div class="flex justify-between text-sm border-t border-gray-200 dark:border-gray-600 pt-2">
                <span class="text-gray-600 dark:text-gray-300 font-semibold">{{ $t('totalUsage') }}</span>
                <span class="text-chapa-purple-500 font-semibold">{{ totalUsage }}</span>
              </div>
            </div>

            <!-- Storage Actions -->
            <div class="flex space-x-2 pt-2">
              <button 
                @click="exportData"
                class="flex-1 btn-secondary flex items-center justify-center space-x-2 py-2"
              >
                <Icon icon="material-symbols:download" class="text-lg" />
                <span class="text-sm">{{ $t('exportData') }}</span>
              </button>
              <button 
                @click="clearData"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Icon icon="material-symbols:delete" class="text-lg" />
                <span class="text-sm">{{ $t('clearData') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Legal & About -->
        <div class="chapa-glass-card p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <Icon icon="material-symbols:gavel" class="text-chapa-purple-500" />
            <span>Legal & About</span>
          </h3>
          <div class="space-y-2">
            <button @click="openLegal('privacy')" class="w-full text-left p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
              <div class="flex items-center space-x-3">
                <Icon icon="material-symbols:privacy-tip" class="text-chapa-purple-500" />
                <span class="font-poppins">Privacy Policy</span>
              </div>
            </button>
            <button @click="openLegal('tos')" class="w-full text-left p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
              <div class="flex items-center space-x-3">
                <Icon icon="material-symbols:description" class="text-chapa-purple-500" />
                <span class="font-poppins">Terms of Service</span>
              </div>
            </button>
            <button @click="openLegal('disclaimer')" class="w-full text-left p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
              <div class="flex items-center space-x-3">
                <Icon icon="material-symbols:warning" class="text-chapa-orange-500" />
                <span class="font-poppins">Legal Disclaimer</span>
              </div>
            </button>
          </div>
        </div>

        <!-- App Information -->
        <div class="chapa-glass-card p-6 text-center">
          <div class="bird-nod mb-4">
            <Icon icon="noto:bird" class="text-4xl text-chapa-purple-500" />
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 font-cal">ChapaDocs</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 font-poppins mb-1">No snake deals - only clean contracts !"</p>
          <p class="text-sm text-gray-600 dark:text-gray-300 font-poppins mb-1">Version 1.0.0</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 font-poppins">
            {{ $t('appDescription') }}
          </p>
          
          <!-- Social Links -->
          <div class="flex justify-center space-x-4 mb-4">
            <button class="text-gray-500 hover:text-chapa-purple-500 transition-colors">
              <Icon icon="logos:telegram" class="text-xl" />
            </button>
            <button class="text-gray-500 hover:text-chapa-purple-500 transition-colors">
              <Icon icon="logos:instagram-icon" class="text-xl" />
            </button>
            <button class="text-gray-500 hover:text-chapa-purple-500 transition-colors">
              <Icon icon="logos:github-icon" class="text-xl" />
            </button>
          </div>

          <!-- App Actions -->
          <div class="space-y-2">
            <button class="w-full btn-secondary flex items-center justify-center space-x-2 py-2">
              <Icon icon="material-symbols:rate-review" class="text-lg" />
              <span class="text-sm">{{ $t('rateApp') }}</span>
            </button>
            <button class="w-full btn-secondary flex items-center justify-center space-x-2 py-2">
              <Icon icon="material-symbols:share" class="text-lg" />
              <span class="text-sm">{{ $t('shareApp') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- License Activation Modal -->
    <div v-if="showLicenseModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="chapa-glass-card p-6 max-w-md w-full">
        <h3 class="text-xl font-cal text-chapa-purple-600 mb-4">Activate License</h3>
        <div class="space-y-4">
          <input 
            v-model="licenseKey"
            type="text" 
            placeholder="Enter your license key"
            class="input-modern w-full"
          >
          <div class="flex space-x-2">
            <button @click="activateLicense" class="btn-primary flex-1">Activate</button>
            <button @click="showLicenseModal = false" class="btn-secondary flex-1">Cancel</button>
          </div>
          <p class="text-xs text-gray-500 text-center">
            Don't have a license? 
            <a href="#" class="text-chapa-purple-500 hover:underline">Get one here</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// License System
const isLicensed = ref(false)
const showLicenseModal = ref(false)
const licenseKey = ref('')

// Settings
const settings = ref({
  autoSave: true,
  autoBackup: false
})

// Language System
const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'circle-flags:uk' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'circle-flags:fr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: 'circle-flags:eg' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: 'circle-flags:tz' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: 'circle-flags:ng' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: 'circle-flags:ng' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: 'circle-flags:ng' }
]

const currentLanguage = ref('en')

// FIXED: Proper dark mode initialization
const isDarkMode = ref(false)

// Storage Stats
const contractsCount = ref(0)
const templatesCount = ref(0)
const signaturesCount = ref(0)
const totalUsage = computed(() => {
  const totalKB = contractsCount.value * 5 + templatesCount.value * 10 + signaturesCount.value * 2
  return totalKB > 1024 ? `${(totalKB / 1024).toFixed(1)} MB` : `${totalKB} KB`
})

// Methods
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  // Save preference to localStorage
  localStorage.setItem('chapa-theme', isDarkMode.value ? 'dark' : 'light')
  // Apply to document
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

const changeLanguage = (langCode: string) => {
  currentLanguage.value = langCode
  localStorage.setItem('chapa-language', langCode)
}

const toggleAutoSave = () => {
  settings.value.autoSave = !settings.value.autoSave
  localStorage.setItem('chapa-settings', JSON.stringify(settings.value))
}

const toggleAutoBackup = () => {
  settings.value.autoBackup = !settings.value.autoBackup
  localStorage.setItem('chapa-settings', JSON.stringify(settings.value))
}

const activateLicense = () => {
  if (licenseKey.value.trim()) {
    isLicensed.value = true
    showLicenseModal.value = false
    licenseKey.value = ''
    localStorage.setItem('chapa-license', 'active')
  }
}

const manageLicense = () => {
  showLicenseModal.value = true
}

const exportData = () => {
  // TODO: Export contracts and templates
  alert('Export functionality coming soon!')
}

const clearData = () => {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    localStorage.clear()
    contractsCount.value = 0
    templatesCount.value = 0
    signaturesCount.value = 0
    alert('Data cleared successfully!')
  }
}

// FIXED: Proper navigation without redirecting back to settings
const openLegal = (type: string) => {
  router.push(`/legal?tab=${type}`)
}

// Temporary i18n function
const $t = (key: string) => {
  const translations: { [key: string]: { [key: string]: string } } = {
    en: {
      language: 'Language',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      storage: 'Storage',
      totalUsage: 'Total Usage',
      exportData: 'Export',
      clearData: 'Clear Data',
      appDescription: 'Official business documents made in Africa',
      rateApp: 'Rate App',
      shareApp: 'Share App'
    },
    fr: {
      language: 'Langue',
      appearance: 'Apparence',
      darkMode: 'Mode Sombre',
      lightMode: 'Mode Lumière',
      storage: 'Stockage',
      totalUsage: 'Utilisation Totale',
      exportData: 'Exporter',
      clearData: 'Effacer les Données',
      appDescription: 'Documents commerciaux officiels fabriqués en Afrique',
      rateApp: 'Évaluer l\'App',
      shareApp: 'Partager l\'App'
    },
    ar: {
      language: 'اللغة',
      appearance: 'المظهر',
      darkMode: 'الوضع الليلي',
      lightMode: 'الوضع العادي',
      storage: 'التخزين',
      totalUsage: 'إجمالي الاستخدام',
      exportData: 'تصدير',
      clearData: 'مسح البيانات',
      appDescription: 'مستندات الأعمال الرسمية المصنوعة في أفريقيا',
      rateApp: 'قيم التطبيق',
      shareApp: 'شارك التطبيق'
    }
  }
  
  return translations[currentLanguage.value]?.[key] || translations.en[key] || key
}

// FIXED: Proper initialization
onMounted(() => {
  // Load theme preference
  const savedTheme = localStorage.getItem('chapa-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  // Priority: saved preference > system preference > light mode
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    isDarkMode.value = prefersDark
  }
  
  // Apply theme to document
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  
  // Load language preference
  const savedLanguage = localStorage.getItem('chapa-language')
  if (savedLanguage) {
    currentLanguage.value = savedLanguage
  }
  
  // Load settings
  const savedSettings = localStorage.getItem('chapa-settings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
  }
  
  // Load license status
  const licenseStatus = localStorage.getItem('chapa-license')
  isLicensed.value = licenseStatus === 'active'
})
</script>