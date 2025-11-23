import { defineStore } from 'pinia'
import { Contract, ContractEngine } from '@/utils/contracts'
import { Signature, SignatureEngine } from '@/utils/signature'
import { CloudStorageManager } from '@/engine/CloudStorageManager' // ADD THIS
import { NotificationManager } from '@/engine/NotificationManager' // ADD THIS

export const useContractStore = defineStore('contracts', {
  state: () => ({
    contracts: [] as Contract[],
    currentContract: null as Contract | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getContractById: (state) => (id: string) => {
      return state.contracts.find(contract => contract.id === id)
    },
    
    getContractsByType: (state) => (type: string) => {
      return state.contracts.filter(contract => contract.type === type)
    },
    
    draftContracts: (state) => {
      return state.contracts.filter(contract => contract.status === 'draft')
    },
    
    activeContracts: (state) => {
      return state.contracts.filter(contract => contract.status === 'active')
    }
  },

  actions: {
    async initialize() {
      this.isLoading = true
      try {
        const engine = new ContractEngine()
        this.contracts = await engine.getAllContracts()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load contracts'
      } finally {
        this.isLoading = false
      }
    },

    async createContract(contractData: Partial<Contract>) {
      this.isLoading = true
      try {
        const engine = new ContractEngine()
        const newContract = await engine.createContract(contractData)
        this.contracts.unshift(newContract)
        this.currentContract = newContract
        return newContract
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create contract'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateContract(id: string, updates: Partial<Contract>) {
      this.isLoading = true
      try {
        const engine = new ContractEngine()
        const updatedContract = await engine.updateContract(id, updates)
        
        const index = this.contracts.findIndex(c => c.id === id)
        if (index !== -1) {
          this.contracts[index] = updatedContract
        }
        
        if (this.currentContract?.id === id) {
          this.currentContract = updatedContract
        }
        
        return updatedContract
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update contract'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteContract(id: string) {
      this.isLoading = true
      try {
        const engine = new ContractEngine()
        await engine.deleteContract(id)
        this.contracts = this.contracts.filter(contract => contract.id !== id)
        
        if (this.currentContract?.id === id) {
          this.currentContract = null
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete contract'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    setCurrentContract(contract: Contract | null) {
      this.currentContract = contract
    },

    clearError() {
      this.error = null
    },

    async addSignature(contractId: string, signatureData: any, party: 'firstParty' | 'secondParty') {
      this.isLoading = true
      try {
        const signatureEngine = new SignatureEngine()
        let signature: Signature

        switch (signatureData.type) {
          case 'draw':
          case 'image':
            signature = await signatureEngine.createImageSignature(contractId, party, signatureData.data)
            break
          case 'text':
            signature = await signatureEngine.createTextSignature(contractId, party, signatureData.data)
            break
          default:
            throw new Error('Invalid signature type')
        }

        // Update contract with signature
        const contract = this.contracts.find(c => c.id === contractId)
        if (contract) {
          contract.signatures[party] = {
            signature: signature.data,
            signedAt: signature.createdAt
          }
          contract.updatedAt = new Date().toISOString()
        }

        // NEW: Show notification
        await NotificationManager.showNotification({
          type: 'success',
          title: 'Signature Added',
          message: `${party === 'firstParty' ? 'First' : 'Second'} party signature saved`
        })

        return signature
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to add signature'
        
        // NEW: Show error notification
        await NotificationManager.showNotification({
          type: 'error',
          title: 'Signature Error',
          message: 'Failed to save signature'
        })
        
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async getContractSignatures(contractId: string): Promise<Signature[]> {
      try {
        const signatureEngine = new SignatureEngine()
        return await signatureEngine.getSignaturesForContract(contractId)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load signatures'
        throw error
      }
    },

    // NEW: Cloud Storage Integration
    async saveToCloud(contract: Contract, provider: 'google' | 'onedrive') {
      try {
        if (provider === 'google') {
          await CloudStorageManager.saveToGoogleDrive(contract)
        } else {
          await CloudStorageManager.saveToOneDrive(contract)
        }
      } catch (error) {
        this.error = `Failed to save to ${provider}: ${error}`
        throw error
      }
    },

    // NEW: Get cloud sync status
    async getCloudSyncStatus(contractId: string) {
      try {
        return await CloudStorageManager.getContractSyncStatus(contractId)
      } catch (error) {
        console.error('Failed to get cloud sync status:', error)
        return { google: undefined, onedrive: undefined }
      }
    }
  }
})