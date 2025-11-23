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
        <!-- License & Authentication - CORRECTED -->
        <div class="chapa-glass-card p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <Icon icon="material-symbols:lock" class="text-chapa-purple-500" />
            <span>License & Access</span>
          </h3>
          <div class="space-y-3">
            <!-- Free User -->
            <div v-if="!currentLicense" class="text-center py-4">
              <Icon icon="material-symbols:lock-outline" class="text-4xl text-chapa-orange-500 mb-2" />
              <p class="text-gray-600 dark:text-gray-300 mb-4">Get started with a free license or upgrade for premium features</p>
              <div class="space-y-2">
                <button @click="generateFreeLicense" class="btn-secondary w-full">
                  Get Free License
                </button>
                <button @click="showUpgradeModal = true" class="btn-primary w-full">
                  Upgrade Plan
                </button>
              </div>
            </div>

            <!-- Free License Active -->
            <div v-else-if="currentLicense.type === 'free'" class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div class="flex items-center space-x-2">
                  <Icon icon="material-symbols:check-circle" class="text-blue-500 text-xl" />
                  <span class="text-blue-700 dark:text-blue-300 font-medium">Free License Active</span>
                </div>
                <span class="text-xs text-blue-600 dark:text-blue-400">15 contracts/month</span>
              </div>
              
              <!-- Contract Usage -->
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600 dark:text-gray-300">Contracts this month:</span>
                  <span class="font-semibold">{{ currentLicense.contractsThisMonth }}/{{ currentLicense.maxContracts }}</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-chapa-purple-500 h-2 rounded-full transition-all duration-500"
                    :style="{ width: `${(currentLicense.contractsThisMonth / currentLicense.maxContracts) * 100}%` }"
                  ></div>
                </div>
              </div>

              <button @click="showUpgradeModal = true" class="w-full btn-primary">
                Upgrade for More Features
              </button>
            </div>

            <!-- Paid License Active -->
            <div v-else class="space-y-2">
              <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div class="flex items-center space-x-2">
                  <Icon icon="material-symbols:check-circle" class="text-green-500 text-xl" />
                  <span class="text-green-700 dark:text-green-300 font-medium">{{ getLicenseTierName(currentLicense.type) }}</span>
                </div>
                <span class="text-xs text-green-600 dark:text-green-400 uppercase">{{ currentLicense.type }}</span>
              </div>
              
              <!-- License Details -->
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">License Key:</span>
                  <span class="font-mono text-xs">{{ currentLicense.key }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Expires:</span>
                  <span>{{ formatDate(currentLicense.expiresAt) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Contract Limit:</span>
                  <span>{{ getContractLimitText(currentLicense) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">Watermark:</span>
                  <span>{{ getWatermarkText(currentLicense) }}</span>
                </div>
              </div>

              <div class="flex space-x-2">
                <button @click="showUpgradeModal = true" class="flex-1 btn-secondary">
                  Change Plan
                </button>
                <button @click="renewLicense" class="flex-1 btn-primary">
                  Renew
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Features Card - CORRECTED -->
        <div class="chapa-glass-card p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <Icon icon="material-symbols:featured-seasonal-and-gifts" class="text-chapa-purple-500" />
            <span>Your Features</span>
          </h3>
          <div class="space-y-3">
            <!-- Feature List -->
            <div v-for="feature in currentFeatures" :key="feature.name" 
                 class="flex items-center justify-between p-3 rounded-lg border"
                 :class="feature.enabled 
                   ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                   : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'">
              <div class="flex items-center space-x-3">
                <Icon :icon="feature.icon" class="text-xl" :class="feature.enabled ? 'text-green-500' : 'text-gray-400'" />
                <div>
                  <div class="font-medium text-sm" :class="feature.enabled ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'">
                    {{ feature.name }}
                  </div>
                  <div class="text-xs" :class="feature.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-500'">
                    {{ feature.description }}
                  </div>
                </div>
              </div>
              <Icon v-if="feature.enabled" icon="material-symbols:check-circle" class="text-green-500" />
              <Icon v-else icon="material-symbols:lock" class="text-gray-400" />
            </div>

            <!-- Upgrade Prompt for Free Users -->
            <div v-if="!currentLicense || currentLicense.type === 'free'" class="mt-4 p-4 bg-gradient-to-r from-chapa-purple-500 to-chapa-purple-600 rounded-lg text-white text-center">
              <h4 class="font-semibold mb-2">Unlock All Features</h4>
              <p class="text-sm opacity-90 mb-3">Upgrade to access premium capabilities</p>
              <button @click="showUpgradeModal = true" class="btn-secondary bg-white text-chapa-purple-600 hover:bg-gray-100 text-sm">
                View Upgrade Options
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
<!-- Cloud Storage Integration -->
<div class="chapa-glass-card p-6">
  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
    <Icon icon="material-symbols:cloud-sync" class="text-chapa-purple-500" />
    <span>Cloud Storage</span>
  </h3>
  
  <div class="space-y-4">
    <!-- Google Drive -->
    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div class="flex items-center space-x-3">
        <Icon icon="logos:google-drive" class="text-xl" />
        <div>
          <div class="font-medium text-sm">Google Drive</div>
          <div v-if="googleDriveInfo.connected" class="text-xs text-green-500">
            Connected • {{ formatConnectionDate(googleDriveInfo.connectedAt) }}
          </div>
          <div v-else class="text-xs text-gray-500">Backup your contracts to Google Drive</div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          v-if="googleDriveInfo.connected"
          @click="disconnectGoogleDrive"
          class="btn-secondary text-xs px-3 py-1"
        >
          Disconnect
        </button>
        <button 
          v-else
          @click="connectGoogleDrive"
          class="btn-primary text-xs px-3 py-1"
        >
          Connect
        </button>
      </div>
    </div>

    <!-- OneDrive -->
    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div class="flex items-center space-x-3">
        <Icon icon="simple-icons:microsoftonedrive" class="text-xl text-blue-500" />
        <div>
          <div class="font-medium text-sm">OneDrive</div>
          <div v-if="oneDriveInfo.connected" class="text-xs text-green-500">
            Connected • {{ formatConnectionDate(oneDriveInfo.connectedAt) }}
          </div>
          <div v-else class="text-xs text-gray-500">Sync with Microsoft cloud</div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          v-if="oneDriveInfo.connected"
          @click="disconnectOneDrive"
          class="btn-secondary text-xs px-3 py-1"
        >
          Disconnect
        </button>
        <button 
          v-else
          @click="connectOneDrive"
          class="btn-primary text-xs px-3 py-1"
        >
          Connect
        </button>
      </div>
    </div>
  </div>
</div>

   <!-- API Key Section -->
<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
  <h4 class="font-semibold text-gray-800 dark:text-white mb-3 flex items-center space-x-2">
    <Icon icon="material-symbols:key" class="text-chapa-orange-500" />
    <span>API Access</span>
  </h4>
  
  <div v-if="apiKey" class="space-y-3">
    <div class="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
      <Icon icon="material-symbols:check-circle" class="text-green-500" />
      <span class="text-sm text-green-700 dark:text-green-300">API Key Generated</span>
    </div>
    
    <div class="flex items-center space-x-2">
      <input 
        :value="apiKey" 
        readonly 
        class="flex-1 text-xs p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded font-mono"
      >
      <button @click="copyApiKey" class="btn-secondary text-xs px-3 py-2">
        Copy
      </button>
    </div>
    
    <p class="text-xs text-gray-500">
      Use this key to integrate with your CRM systems
    </p>
  </div>
  
  <button 
    v-else
    @click="generateApiKey"
    class="btn-primary w-full text-sm"
    :disabled="!canGenerateApiKey"
  >
    Generate API Key
  </button>

  <!-- API Key Feature Gating (Industrial Plan Only) -->
  <div v-if="!canGenerateApiKey" class="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
    <div class="flex items-center space-x-2 text-orange-700 dark:text-orange-300">
      <Icon icon="material-symbols:lock" />
      <span class="text-sm font-medium">Industrial Plan Required</span>
    </div>
    <p class="text-xs text-orange-600 dark:text-orange-400 mt-1">
      API access for CRM integrations requires Industrial plan
    </p>
    <button @click="showUpgradeModal = true" class="btn-primary text-xs mt-2 px-3 py-1">
      Upgrade Now
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

   <!-- Upgrade Plan Modal - FIXED POSITION -->
<div v-if="showUpgradeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div class="chapa-glass-card p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-cal text-chapa-purple-600 dark:text-chapa-purple-300">Upgrade Your Plan</h3>
      <button @click="showUpgradeModal = false" class="btn-ghost p-2">
        <Icon icon="material-symbols:close" class="text-xl" />
      </button>
    </div>
    
    <!-- Plans Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Starter Plan -->
      <div class="plan-card border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:border-chapa-purple-300 hover:shadow-lg">
        <div class="text-center mb-6">
          <h4 class="text-xl font-cal text-gray-800 dark:text-white mb-2">Starter</h4>
          <div class="text-3xl font-bold text-chapa-purple-600 dark:text-chapa-purple-300">$5.99<span class="text-sm font-normal text-gray-500">/month</span></div>
        </div>
        
        <ul class="space-y-3 mb-6">
          <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
            <span>250 contracts/month</span>
          </li>
          <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
            <span>PDF export with footer watermark</span>
          </li>
          <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
            <span>Google Drive & OneDrive integration</span>
          </li>
        </ul>
        
        <button @click="purchaseLicense('starter')" class="btn-secondary w-full">
          Choose Starter
        </button>
      </div>

      <!-- Agent Plan -->
      <div class="plan-card border-2 border-chapa-purple-500 rounded-2xl p-6 bg-gradient-to-b from-chapa-purple-50 to-white dark:from-chapa-purple-900/20 dark:to-gray-800 transition-all duration-300 hover:shadow-xl relative">
        <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span class="bg-chapa-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">POPULAR</span>
        </div>
        
        <div class="text-center mb-6">
          <h4 class="text-xl font-cal text-gray-800 dark:text-white mb-2">Agent</h4>
          <div class="text-3xl font-bold text-chapa-purple-600 dark:text-chapa-purple-300">$10.99<span class="text-sm font-normal text-gray-500">/month</span></div>
        </div>
        
        <ul class="space-y-3 mb-6">
          <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
            <span>1000 contracts/month</span>
          </li>
          <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
            <span>Contribution system access</span>
          </li>
          <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
            <span>CRM integrations</span>
          </li>
          <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
            <span>Light watermark</span>
          </li>
        </ul>
        
        <button @click="purchaseLicense('agent')" class="btn-primary w-full">
          Choose Agent
        </button>
      </div>

      <!-- Industrial Plan -->
      <div class="plan-card border-2 border-chapa-orange-500 rounded-2xl p-6 bg-gradient-to-b from-chapa-orange-50 to-white dark:from-chapa-orange-900/20 dark:to-gray-800 transition-all duration-300 hover:shadow-lg">
        <div class="text-center mb-6">
          <h4 class="text-xl font-cal text-gray-800 dark:text-white mb-2">Industrial</h4>
          <div class="text-3xl font-bold text-chapa-orange-600 dark:text-chapa-orange-300">$25.99<span class="text-sm font-normal text-gray-500">/month</span></div>
        </div>
        
        <ul class="space-y-3 mb-6">
          <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
            <span>Unlimited contracts</span>
          </li>
          <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
            <span>No watermark</span>
          </li>
          <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
            <span>Free advertising when contributing</span>
          </li>
          <li class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
            <span>All integrations</span>
          </li>
        </ul>
        
        <button @click="purchaseLicense('industrial')" class="btn-accent w-full">
          Choose Industrial
        </button>
      </div>
    </div>

    <!-- Crypto Payment Section -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div class="text-center">
        <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center justify-center space-x-2">
          <Icon icon="material-symbols:currency-bitcoin" class="text-chapa-orange-500" />
          <span>Pay with Crypto</span>
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          We accept USDT, USDC, and ETH for fast, secure payments
        </p>
        <div class="flex flex-wrap justify-center gap-3 mb-4">
          <span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">USDT</span>
          <span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">USDC</span>
          <span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">ETH</span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          All payments processed securely via our POS system, no transaction fees aside blockchain standard fees
        </p>
      </div>
    </div>
  </div>
</div>

<!-- License Activation Modal - FIXED POSITION -->
<div v-if="showLicenseModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div class="chapa-glass-card p-6 max-w-md w-full">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-cal text-chapa-purple-600 dark:text-chapa-purple-300">Activate Paid License</h3>
      <button @click="showLicenseModal = false" class="btn-ghost p-2">
        <Icon icon="material-symbols:close" class="text-xl" />
      </button>
    </div>
    <div class="space-y-4">
      <input 
        v-model="licenseKey"
        type="text" 
        placeholder="Enter your license key (e.g., CHAPA-STARTER-ABC123)"
        class="input-modern w-full font-mono text-sm"
      >
      <div class="flex space-x-2">
        <button @click="activatePaidLicense" class="btn-primary flex-1">Activate</button>
        <button @click="showLicenseModal = false" class="btn-secondary flex-1">Cancel</button>
      </div>
      <p class="text-xs text-gray-500 text-center">
        Purchase a license key from 
        <a href="https://bisi.o" target="_blank" class="text-chapa-purple-500 hover:underline">bisi.o</a>
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
import { useLicenseStore } from '@/stores/license'
import { UniversalLicenseManager, UniversalLicense } from '@/utils/licenseManager'
import UpgradePlan from '@/components/ui/UpgradePlan.vue'
import { CloudStorageManager } from '@/engine/CloudStorageManager'

const router = useRouter()
const licenseStore = useLicenseStore()

// Cloud Storage State - make them computed properties
const googleDriveConnected = computed(() => CloudStorageManager.isGoogleDriveConnected())
const oneDriveConnected = computed(() => CloudStorageManager.isOneDriveConnected())

const connectGoogleDrive = async () => {
  // REMOVED license check - cloud storage for everyone
  // if (!canUseCloudStorage.value) {
  //   showUpgradeModal.value = true
  //   return
  // }
  
  const success = await CloudStorageManager.connectGoogleDrive()
  if (success) {
    loadCloudStorageStatus()
  }
}

const connectOneDrive = async () => {
  // REMOVED license check - cloud storage for everyone
  // if (!canUseCloudStorage.value) {
  //   showUpgradeModal.value = true
  //   return
  // }
  
  const success = await CloudStorageManager.connectOneDrive()
  if (success) {
    loadCloudStorageStatus()
  }
}

// License System
const currentLicense = ref<UniversalLicense | null>(null)
const showLicenseModal = ref(false)
const showUpgradeModal = ref(false)
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

// Dark Mode
const isDarkMode = ref(false)
const canUseCloudStorage = computed(() => true)
// Storage Stats
const contractsCount = ref(0)
const templatesCount = ref(0)
const signaturesCount = ref(0)
const totalUsage = computed(() => {
  const totalKB = contractsCount.value * 5 + templatesCount.value * 10 + signaturesCount.value * 2
  return totalKB > 1024 ? `${(totalKB / 1024).toFixed(1)} MB` : `${totalKB} KB`
})

// Computed: Current user features based on license
const currentFeatures = computed(() => {
  const license = currentLicense.value
  const isFree = !license || license.type === 'free'
  const isStarter = license?.type === 'starter'
  const isAgent = license?.type === 'agent'
  const isIndustrial = license?.type === 'industrial'
  
  return [
    {
      name: 'Contract Creation',
      description: getContractLimitText(license),
      icon: 'material-symbols:description',
      enabled: true
    },
    {
      name: 'PDF Export',
      description: getWatermarkText(license),
      icon: 'material-symbols:print',
      enabled: license?.canPrint || false
    },
    {
      name: 'Cloud Storage',
      description: 'Google Drive & OneDrive backup',
      icon: 'material-symbols:cloud',
      enabled: true // Everyone gets cloud storage!
    },
    {
      name: 'Contribution System',
      description: 'Share contract templates',
      icon: 'material-symbols:group',
      enabled: license?.canContribute || false
    },
    {
      name: 'CRM Integration',
      description: 'API access for business tools',
      icon: 'material-symbols:link',
      enabled: isIndustrial // Only Industrial gets API keys
    },
    {
      name: 'No Watermark',
      description: 'Professional documents',
      icon: 'material-symbols:visibility-off',
      enabled: isIndustrial
    }
  ]
})
// Helper Methods
const getLicenseTierName = (type: string) => {
  const names: { [key: string]: string } = {
    'free': 'Free Plan',
    'starter': 'Starter Plan',
    'agent': 'Agent Plan', 
    'industrial': 'Industrial Plan'
  }
  return names[type] || type
}

const getContractLimitText = (license: UniversalLicense | null) => {
  if (!license) return '15 contracts/month'
  
  switch (license.type) {
    case 'free': return '15 contracts/month'
    case 'starter': return '250 contracts/month'
    case 'agent': return '1000 contracts/month'
    case 'industrial': return 'Unlimited contracts'
    default: return '15 contracts/month'
  }
}

const getWatermarkText = (license: UniversalLicense | null) => {
  if (!license) return 'With watermark'
  
  switch (license.type) {
    case 'free': return 'With watermark'
    case 'starter': return 'Footer watermark'
    case 'agent': return 'Light watermark'
    case 'industrial': return 'No watermark'
    default: return 'With watermark'
  }
}

const getStorageText = (license: UniversalLicense | null) => {
  if (!license) return 'Google Drive & OneDrive'
  
  switch (license.type) {
    case 'free':
    case 'starter': 
      return 'Google Drive & OneDrive'
    case 'agent':
      return 'Google Drive, OneDrive & iCloud'
    case 'industrial':
      return 'All platforms + CRM'
    default:
      return 'Google Drive & OneDrive'
  }
}

const formatDate = (date: Date | null) => {
  if (!date) return 'Never'
  return new Date(date).toLocaleDateString()
}

// License Methods
const generateFreeLicense = () => {
  const freeLicense = UniversalLicenseManager.generateFreeLicense('chapadocs')
  licenseStore.generateFreeLicense()
  currentLicense.value = freeLicense
}

const activatePaidLicense = async () => {
  if (!licenseKey.value.trim()) return
  
  try {
    const result = await UniversalLicenseManager.activatePaidLicense(licenseKey.value)
    if (result.success && result.license) {
      currentLicense.value = result.license
      showLicenseModal.value = false
      licenseKey.value = ''
      alert('🎉 License activated successfully!')
    } else {
      alert('❌ Invalid license key. Please check and try again.')
    }
  } catch (error) {
    alert('❌ Failed to activate license. Please check your connection.')
  }
}

const renewLicense = async () => {
  if (!currentLicense.value) return
  
  try {
    const result = await UniversalLicenseManager.validatePaidLicense(currentLicense.value.key)
    if (result.valid && result.license) {
      currentLicense.value = result.license
      alert('✅ License renewed successfully!')
    } else {
      alert('❌ License renewal failed. Please check your payment.')
    }
  } catch (error) {
    alert('❌ Renewal failed. Please try again.')
  }
}

// Add this method to purchase licenses
const purchaseLicense = (planType: string) => {
  UniversalLicenseManager.purchaseLicense('chapadocs', planType)
  showUpgradeModal = false
}
// Settings Methods
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('chapa-theme', isDarkMode.value ? 'dark' : 'light')
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

// Cloud Storage State
const googleDriveConnected = ref(false)
const oneDriveConnected = ref(false)
const apiKey = ref('')

// Computed: Feature gating based on license
const canUseCloudStorage = computed(() => {
  return currentLicense.value?.type === 'agent' || currentLicense.value?.type === 'industrial'
})

const canGenerateApiKey = computed(() => {
  return currentLicense.value?.type === 'agent' || currentLicense.value?.type === 'industrial'
})

// Cloud Storage Methods
const connectGoogleDrive = async () => {
  if (!canUseCloudStorage.value) {
    showUpgradeModal.value = true
    return
  }
  
  // Simple implementation - in production, use proper OAuth
  try {
    // This would open OAuth flow in real implementation
    showNotification('Redirecting to Google Drive authentication...', 'info')
    
    // Simulate connection
    setTimeout(() => {
      googleDriveConnected.value = true
      localStorage.setItem('google_drive_connected', 'true')
      showNotification('Google Drive connected successfully!', 'success')
    }, 2000)
    
  } catch (error) {
    showNotification('Failed to connect Google Drive', 'error')
  }
}

const connectOneDrive = async () => {
  if (!canUseCloudStorage.value) {
    showUpgradeModal.value = true
    return
  }
  
  try {
    showNotification('Redirecting to OneDrive authentication...', 'info')
    
    // Simulate connection
    setTimeout(() => {
      oneDriveConnected.value = true
      localStorage.setItem('one_drive_connected', 'true')
      showNotification('OneDrive connected successfully!', 'success')
    }, 2000)
    
  } catch (error) {
    showNotification('Failed to connect OneDrive', 'error')
  }
}

// API Key Methods
const generateApiKey = () => {
  if (!canGenerateApiKey.value) {
    showUpgradeModal.value = true
    return
  }
  
  // Generate a simple API key (in production, this would be from your server)
  const newApiKey = `CHAPA-${Math.random().toString(36).substr(2, 16).toUpperCase()}`
  apiKey.value = newApiKey
  localStorage.setItem('chapa_api_key', newApiKey)
  showNotification('API key generated successfully!', 'success')
}

const copyApiKey = async () => {
  if (!apiKey.value) return
  
  try {
    await navigator.clipboard.writeText(apiKey.value)
    showNotification('API key copied to clipboard!', 'success')
  } catch (err) {
    // Fallback
    const textArea = document.createElement('textarea')
    textArea.value = apiKey.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showNotification('API key copied to clipboard!', 'success')
  }
}

// Enhanced notification system
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const notification = document.createElement('div')
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  
  notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg font-poppins text-sm transition-all duration-300`
  notification.textContent = message
  notification.style.opacity = '0'
  notification.style.transform = 'translateX(-50%) translateY(-20px)'
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.opacity = '1'
    notification.style.transform = 'translateX(-50%) translateY(0)'
  }, 100)
  
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

// Load cloud storage status on mount
const loadCloudStorageStatus = () => {
  googleDriveConnected.value = localStorage.getItem('google_drive_connected') === 'true'
  oneDriveConnected.value = localStorage.getItem('one_drive_connected') === 'true'
  apiKey.value = localStorage.getItem('chapa_api_key') || ''
}

const exportData = () => {
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
// Add to your data/refs
const googleDriveInfo = ref({
  connected: false,
  connectedAt: null as string | null,
  userId: null as string | null
})

const oneDriveInfo = ref({
  connected: false,
  connectedAt: null as string | null,
  userId: null as string | null
})

// Add computed for cloud status
const canUseCloudStorage = computed(() => {
  return currentLicense.value?.type === 'agent' || currentLicense.value?.type === 'industrial'
})

// Add methods
const connectGoogleDrive = async () => {
  if (!canUseCloudStorage.value) {
    showUpgradeModal.value = true
    return
  }
  
  const success = await CloudStorageManager.connectGoogleDrive()
  if (success) {
    loadCloudStorageStatus()
  }
}

const connectOneDrive = async () => {
  if (!canUseCloudStorage.value) {
    showUpgradeModal.value = true
    return
  }
  
  const success = await CloudStorageManager.connectOneDrive()
  if (success) {
    loadCloudStorageStatus()
  }
}

const disconnectGoogleDrive = () => {
  CloudStorageManager.disconnectGoogleDrive()
  loadCloudStorageStatus()
}

const disconnectOneDrive = () => {
  CloudStorageManager.disconnectOneDrive()
  loadCloudStorageStatus()
}

const formatConnectionDate = (dateString: string | null) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const loadCloudStorageStatus = () => {
  googleDriveInfo.value = CloudStorageManager.getGoogleDriveInfo()
  oneDriveInfo.value = CloudStorageManager.getOneDriveInfo()
}
// Initialize
onMounted(() => {
  loadCloudStorageStatus()
  // Load theme preference
  const savedTheme = localStorage.getItem('chapa-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    isDarkMode.value = prefersDark
  }
  
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
  
  // Load license using the new system
  const savedLicense = UniversalLicenseManager.getStoredLicense('chapadocs')
  if (savedLicense) {
    currentLicense.value = savedLicense
  }
  loadCloudStorageStatus()
})
</script>