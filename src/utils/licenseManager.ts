// SINGLE License interface for ALL apps
export interface UniversalLicense {
  // Core fields (same for all apps)
  id: string
  app: 'chapadocs' | 'zoomka' | 'codescraper' | 'designscraper'
  type: 'free' | 'starter' | 'agent' | 'industrial' | 'pro'
  key: string
  createdAt: Date
  expiresAt: Date | null
  isActive: boolean
  
  // App-specific features (optional based on app)
  contractsThisMonth?: number
  maxContracts?: number
  canContribute?: boolean
  canPrint?: boolean
  watermarkLevel?: 'full' | 'footer' | 'light' | 'none'
  crmIntegrations?: string[]
  storageIntegrations?: string[]
  hasEncryptedChat?: boolean
  // NO email, NO personal data!
}

export class UniversalLicenseManager {
  private static readonly API_BASE = 'https://api.harambee.o/licenses'

  // Generate free license locally (instantly, no server call)
  static generateFreeLicense(app: 'chapadocs' | 'zoomka'): UniversalLicense {
    const licenseId = this.generateUUID()
    
    const baseLicense: UniversalLicense = {
      id: licenseId,
      app: app,
      type: 'free', // FIXED: Explicitly type as 'free'
      key: `${app.toUpperCase().substring(0, 4)}-FREE-${licenseId.substring(0, 8)}`,
      createdAt: new Date(),
      expiresAt: null, // Free licenses never expire
      isActive: true
    }

    // App-specific free tier features
    if (app === 'chapadocs') {
      return {
        ...baseLicense,
        contractsThisMonth: 0,
        maxContracts: 15,
        canContribute: false,
        canPrint: false,
        watermarkLevel: 'full',
        crmIntegrations: [],
        storageIntegrations: ['google_drive', 'one_drive']
      } as UniversalLicense // FIXED: Type assertion
    } else if (app === 'zoomka') {
      return {
        ...baseLicense,
        hasEncryptedChat: false
      } as UniversalLicense // FIXED: Type assertion
    }
    
    return baseLicense
  }

  // FIXED: Add incrementContractCount method
  static incrementContractCount(license: UniversalLicense): void {
    if (license.contractsThisMonth !== undefined) {
      license.contractsThisMonth++
      this.saveLicense(license)
    }
  }

  // Validate license (works offline for free licenses)
  static validateLicense(license: UniversalLicense): boolean {
    if (!license || !license.isActive) return false
    
    // Free licenses always valid (offline)
    if (license.type === 'free') {
      return this.checkMonthlyLimit(license)
    }
    
    // Paid licenses need expiry check
    if (license.expiresAt) {
      return new Date() < new Date(license.expiresAt)
    }
    
    return true
  }

  // Server validation for paid licenses
  static async validatePaidLicense(licenseKey: string): Promise<{valid: boolean; license?: UniversalLicense}> {
    try {
      const response = await fetch(`${this.API_BASE}/validate-license`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey })
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.valid && result.license) {
          // Convert server response to our UniversalLicense format
          const license = this.formatLicenseFromServer(result.license)
          this.saveLicense(license)
          return { valid: true, license }
        }
      }
      return { valid: false }
    } catch (error) {
      console.error('License validation error:', error)
      // Offline fallback
      const license = this.getStoredLicense('chapadocs')
      return { valid: license ? this.validateLicense(license) : false }
    }
  }

  // Activate paid license (after purchase)
  static async activatePaidLicense(licenseKey: string): Promise<{success: boolean; license?: UniversalLicense}> {
    try {
      const response = await fetch(`${this.API_BASE}/validate-license`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey })
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.valid && result.license) {
          const license = this.formatLicenseFromServer(result.license)
          this.saveLicense(license)
          return { success: true, license }
        }
      }
      return { success: false }
    } catch (error) {
      console.error('License activation error:', error)
      return { success: false }
    }
  }

  // Purchase license (redirect to your POS)
  static purchaseLicense(app: string, type: string) {
    const paymentUrl = `https://pos.harambee.o/pay?app=${app}&plan=${type}`
    window.open(paymentUrl, '_blank')
  }

  // Feature checks
  static canUserContribute(license: UniversalLicense): boolean {
    return license.app === 'chapadocs' && ['agent', 'industrial'].includes(license.type)
  }

  static canUserPrint(license: UniversalLicense): boolean {
    return license.app === 'chapadocs' && license.type !== 'free'
  }

  static getWatermarkLevel(license: UniversalLicense): string {
    if (license.app !== 'chapadocs') return 'none'
    
    switch (license.type) {
      case 'free': return 'full'
      case 'starter': return 'footer'
      case 'agent': return 'light'
      case 'industrial': return 'none'
      default: return 'full'
    }
  }

  static hasEncryptedChat(license: UniversalLicense): boolean {
    return license.app === 'zoomka' && license.type === 'pro'
  }

  // Storage methods
  static saveLicense(license: UniversalLicense): void {
    localStorage.setItem(`harambee_license_${license.app}`, JSON.stringify(license))
  }

  static getStoredLicense(app?: string): UniversalLicense | null {
    try {
      if (app) {
        const stored = localStorage.getItem(`harambee_license_${app}`)
        return stored ? JSON.parse(stored) : null
      } else {
        // Get any license (for multi-app support)
        const keys = Object.keys(localStorage).filter(key => key.startsWith('harambee_license_'))
        if (keys.length > 0) {
          const stored = localStorage.getItem(keys[0])
          return stored ? JSON.parse(stored) : null
        }
        return null
      }
    } catch {
      return null
    }
  }

  // Helper methods
  private static checkMonthlyLimit(license: UniversalLicense): boolean {
    if (!license.contractsThisMonth || !license.maxContracts) return true
    
    const now = new Date()
    const created = new Date(license.createdAt)
    
    // Reset counter if new month
    if (now.getMonth() !== created.getMonth() || now.getFullYear() !== created.getFullYear()) {
      license.contractsThisMonth = 0
      this.saveLicense(license)
    }
    
    return license.contractsThisMonth < license.maxContracts
  }

  private static formatLicenseFromServer(serverLicense: any): UniversalLicense {
    return {
      id: serverLicense.id,
      app: serverLicense.app,
      type: serverLicense.type,
      key: serverLicense.key,
      createdAt: new Date(serverLicense.createdAt),
      expiresAt: serverLicense.expiresAt ? new Date(serverLicense.expiresAt) : null,
      isActive: serverLicense.isActive,
      maxContracts: serverLicense.maxContracts,
      canContribute: serverLicense.canContribute,
      canPrint: serverLicense.canPrint,
      watermarkLevel: serverLicense.watermarkLevel,
      crmIntegrations: serverLicense.crmIntegrations,
      storageIntegrations: serverLicense.storageIntegrations,
      hasEncryptedChat: serverLicense.hasEncryptedChat
    } as UniversalLicense
  }

  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}