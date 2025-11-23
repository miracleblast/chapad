import { StorageEngine } from './StorageEngine'

// Contract status management
export class ContractManager {
  private static storage = new StorageEngine()

  static async init() {
    await this.storage.init()
  }

  static async signContract(contractId: string, signature: any, party: 'firstParty' | 'secondParty') {
    const contract = await this.getContract(contractId)
    if (!contract) {
      throw new Error('Contract not found')
    }
    
    // Add signature
    contract.signatures[party] = {
      signature: signature,
      signedAt: new Date().toISOString(),
      partyId: this.getCurrentUserId()
    }
    
    // Update contract status
    contract.status = this.determineContractStatus(contract)
    contract.updatedAt = new Date().toISOString()
    
    // Check if both parties signed
    if (contract.signatures.firstParty && contract.signatures.secondParty) {
      contract.activatedAt = new Date().toISOString()
      
      // Start contract timeline if applicable
      if (contract.type === 'debt') {
        await this.startDebtRepayment(contract)
      }
    }
    
    await this.saveContract(contract)
    return contract
  }

  static async getContract(contractId: string): Promise<any> {
    return await this.storage.getContract(contractId)
  }

  static async saveContract(contract: any): Promise<void> {
    return await this.storage.saveContract(contract)
  }

  static determineContractStatus(contract: any): string {
    if (contract.signatures.firstParty && contract.signatures.secondParty) {
      return 'active'
    } else if (contract.signatures.firstParty || contract.signatures.secondParty) {
      return 'pending'
    } else {
      return 'draft'
    }
  }

  static async startDebtRepayment(contract: any) {
    // Set up repayment schedule, notifications, etc.
    console.log('Debt contract activated:', contract)
    
    // Schedule notifications for repayment
    this.scheduleRepaymentNotifications(contract)
  }

  static scheduleRepaymentNotifications(contract: any) {
    // Implementation for debt repayment notifications
    // This would integrate with your notification system
  }

  static getCurrentUserId(): string {
    const licenseData = localStorage.getItem('chapadocs_license')
    if (licenseData) {
      try {
        const license = JSON.parse(licenseData)
        return license.id || 'unknown'
      } catch {
        return 'unknown'
      }
    }
    return 'unknown'
  }

  // New method to get contracts by status
  static async getContractsByStatus(status: string): Promise<any[]> {
    const allContracts = await this.storage.getAllContracts()
    return allContracts.filter(contract => contract.status === status)
  }

  // New method to update contract status
  static async updateContractStatus(contractId: string, status: string): Promise<void> {
    const contract = await this.getContract(contractId)
    if (contract) {
      contract.status = status
      contract.updatedAt = new Date().toISOString()
      await this.saveContract(contract)
    }
  }
}