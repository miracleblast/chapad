// Simple license validator that works offline for free users
class LicenseManager {
  static async validateLicense(license: any): Promise<boolean> { // ADD async
    // Free licenses always valid
    if (license.type === 'free') {
      return license.isActive && this.checkMonthlyLimit(license)
    }
    
    // Paid licenses need server validation
    return await this.validatePaidLicense(license) // ADD await
  }
  
  static checkMonthlyLimit(license: any): boolean {
    const now = new Date()
    const created = new Date(license.createdAt)
    
    // Reset counter if new month
    if (now.getMonth() !== created.getMonth() || now.getFullYear() !== created.getFullYear()) {
      license.contractsThisMonth = 0
      this.saveLicense(license)
    }
    
    return license.contractsThisMonth < license.maxContracts
  }
  
  static async validatePaidLicense(license: any): Promise<boolean> {
    try {
      // Simple API call to your server
      const response = await fetch('https://api.yourdomain.com/validate-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: license.key })
      })
      
      return response.ok
    } catch (error) {
      // Fallback: check if license hasn't expired
      return new Date(license.expiresAt) > new Date()
    }
  }
  
  static saveLicense(license: any) {
    localStorage.setItem('chapa_license', JSON.stringify(license))
  }
  
  static getLicense(): any {
    const stored = localStorage.getItem('chapa_license')
    return stored ? JSON.parse(stored) : null
  }
}