import { defineStore } from 'pinia'
import { UniversalLicenseManager, UniversalLicense } from '@/utils/licenseManager'

export const useLicenseStore = defineStore('license', {
  state: () => ({
    currentLicense: null as UniversalLicense | null,
    lastValidation: null as Date | null
  }),

  getters: {
    isPremium: (state) => state.currentLicense?.type !== 'free',
    canContribute: (state) => UniversalLicenseManager.canUserContribute(state.currentLicense!),
    canPrint: (state) => UniversalLicenseManager.canUserPrint(state.currentLicense!),
    watermarkLevel: (state) => UniversalLicenseManager.getWatermarkLevel(state.currentLicense!),
    contractsRemaining: (state) => {
      if (!state.currentLicense || !state.currentLicense.maxContracts) return 0
      return state.currentLicense.maxContracts - (state.currentLicense.contractsThisMonth || 0)
    },
    isLicenseValid: (state) => {
      if (!state.currentLicense) return false
      return UniversalLicenseManager.validateLicense(state.currentLicense)
    },
    
    // UPDATED: Cloud storage for everyone
    canUseCloudStorage: (state) => true, // Everyone can use cloud storage
    
    // UPDATED: API Keys only for Industrial plan
    canGenerateApiKey: (state) => {
      return state.currentLicense?.type === 'industrial'
    },
    
    // User ID for sharing
    userLicenseId: (state) => {
      return state.currentLicense?.id || null
    }
  },

  actions: {
    initialize() {
      const savedLicense = UniversalLicenseManager.getStoredLicense('chapadocs')
      if (savedLicense) {
        this.currentLicense = savedLicense
      }
    },

    generateFreeLicense() {
      const freeLicense = UniversalLicenseManager.generateFreeLicense('chapadocs')
      UniversalLicenseManager.saveLicense(freeLicense)
      this.currentLicense = freeLicense
      return freeLicense
    },

    async validateLicense() {
      if (!this.currentLicense) return false

      const result = await UniversalLicenseManager.validatePaidLicense(this.currentLicense.key)
      this.lastValidation = new Date()
      
      if (result.valid && result.license) {
        this.currentLicense = result.license
      }
      
      return result.valid
    },

    incrementContractCount() {
      if (this.currentLicense) {
        UniversalLicenseManager.incrementContractCount(this.currentLicense)
      }
    },

    getLicenseTierName(): string {
      if (!this.currentLicense) return 'Free'
      
      const names: { [key: string]: string } = {
        'free': 'Free Plan',
        'starter': 'Starter Plan',
        'agent': 'Agent Plan', 
        'industrial': 'Industrial Plan'
      }
      return names[this.currentLicense.type] || this.currentLicense.type
    }
  }
})