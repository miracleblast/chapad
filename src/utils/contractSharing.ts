import { StorageEngine } from '../engine/StorageEngine' // FIXED PATH

// Contract status management
export class ContractManager {
  private static storage = new StorageEngine()

  static async init() {
    await this.storage.init()
  }
}
export interface SharedContract {
  id: string // UUID for sharing
  contractId: string // Original contract ID
  ownerId: string // License UUID of owner
  sharedWith?: string // License UUID of recipient (optional)
  accessCode?: string // For extra security
  expiresAt: Date
  isSigned: boolean
  previewUrl: string
  signatureUrl: string
  contractData: any
  templateData: any
}

export class ContractSharing {
  static generateShareLink(contractData: any, templateData: any, accessCode?: string): string {
    const shareId = PrivacyFirstLicenseManager.generateUUID()
    const currentLicense = PrivacyFirstLicenseManager.getStoredLicense()
    
    const sharedContract: SharedContract = {
      id: shareId,
      contractId: contractData.id,
      ownerId: currentLicense?.id || 'anonymous',
      accessCode: accessCode,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isSigned: false,
      previewUrl: `${window.location.origin}/contract-preview/${shareId}`,
      signatureUrl: `${window.location.origin}/sign-contract/${shareId}`,
      contractData: contractData,
      templateData: templateData
    }
    
    this.saveSharedContract(sharedContract)
    
    return sharedContract.previewUrl
  }

  static saveSharedContract(sharedContract: SharedContract): void {
    const sharedContracts = this.getSharedContracts()
    sharedContracts[sharedContract.id] = sharedContract
    localStorage.setItem('chapa_shared_contracts', JSON.stringify(sharedContracts))
  }

  static getSharedContract(shareId: string): SharedContract | null {
    const sharedContracts = this.getSharedContracts()
    return sharedContracts[shareId] || null
  }

  static getSharedContracts(): { [key: string]: SharedContract } {
    try {
      const stored = localStorage.getItem('chapa_shared_contracts')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  static verifyAccessCode(shareId: string, code: string): boolean {
    const contract = this.getSharedContract(shareId)
    return contract?.accessCode === code
  }

  static markAsSigned(shareId: string): void {
    const contract = this.getSharedContract(shareId)
    if (contract) {
      contract.isSigned = true
      this.saveSharedContract(contract)
    }
  }
}