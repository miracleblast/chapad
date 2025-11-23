import { Contract } from '@/utils/contracts'
import { Signature } from '@/utils/signature'

export class StorageEngine {
  private dbName = 'ChapaDocsDB'
  private version = 2 // Bump version for new features
  private db: IDBDatabase | null = null

  // Initialize database
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create contracts store
        if (!db.objectStoreNames.contains('contracts')) {
          const store = db.createObjectStore('contracts', { keyPath: 'id' })
          store.createIndex('slug', 'slug', { unique: false })
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('status', 'status', { unique: false })
          store.createIndex('createdAt', 'createdAt', { unique: false })
          store.createIndex('cloudSync', 'cloudSync', { unique: false })
        }

        // Create signatures store
        if (!db.objectStoreNames.contains('signatures')) {
          const store = db.createObjectStore('signatures', { keyPath: 'id' })
          store.createIndex('contractId', 'contractId', { unique: false })
          store.createIndex('party', 'party', { unique: false })
        }

        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }

        // Create cloud sync store (NEW)
        if (!db.objectStoreNames.contains('cloudSync')) {
          const store = db.createObjectStore('cloudSync', { keyPath: 'id' })
          store.createIndex('contractId', 'contractId', { unique: true })
          store.createIndex('provider', 'provider', { unique: false })
          store.createIndex('syncedAt', 'syncedAt', { unique: false })
        }
      }
    })
  }

  // Enhanced contract operations with cloud sync tracking
  async saveContract(contract: Contract & { cloudSync?: boolean }): Promise<void> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contracts'], 'readwrite')
      const store = transaction.objectStore('contracts')
      
      // Add cloud sync flag if not present
      const contractWithSync = {
        ...contract,
        cloudSync: contract.cloudSync || false,
        updatedAt: new Date().toISOString()
      }
      
      const request = store.put(contractWithSync)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getContract(id: string): Promise<(Contract & { cloudSync?: boolean }) | null> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contracts'], 'readonly')
      const store = transaction.objectStore('contracts')
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async getAllContracts(): Promise<(Contract & { cloudSync?: boolean })[]> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contracts'], 'readonly')
      const store = transaction.objectStore('contracts')
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  async getContractsByStatus(status: string): Promise<Contract[]> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contracts'], 'readonly')
      const store = transaction.objectStore('contracts')
      const index = store.index('status')
      const request = index.getAll(status)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  // Cloud Sync Operations (NEW)
  async markContractAsSynced(contractId: string, provider: 'google' | 'onedrive', remoteId?: string): Promise<void> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contracts', 'cloudSync'], 'readwrite')
      
      // Update contract cloudSync status
      const contractStore = transaction.objectStore('contracts')
      const contractRequest = contractStore.get(contractId)
      
      contractRequest.onsuccess = () => {
        const contract = contractRequest.result
        if (contract) {
          contract.cloudSync = true
          contractStore.put(contract)
        }
      }

      // Add to cloud sync log
      const syncStore = transaction.objectStore('cloudSync')
      const syncRecord = {
        id: `${contractId}_${provider}`,
        contractId,
        provider,
        remoteId,
        syncedAt: new Date().toISOString()
      }
      syncStore.put(syncRecord)

      transaction.onerror = () => reject(transaction.error)
      transaction.oncomplete = () => resolve()
    })
  }

  async getCloudSyncStatus(contractId: string): Promise<{ google?: string; onedrive?: string }> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cloudSync'], 'readonly')
      const store = transaction.objectStore('cloudSync')
      const index = store.index('contractId')
      const request = index.getAll(contractId)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const syncs = request.result || []
        const status: { google?: string; onedrive?: string } = {}
        
        syncs.forEach(sync => {
          status[sync.provider] = sync.syncedAt
        })
        
        resolve(status)
      }
    })
  }

  // Rest of your existing methods (signatures, settings, etc.) remain the same...
  async deleteContract(id: string): Promise<void> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contracts'], 'readwrite')
      const store = transaction.objectStore('contracts')
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // Signature operations
  async saveSignature(signature: Signature): Promise<void> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['signatures'], 'readwrite')
      const store = transaction.objectStore('signatures')
      const request = store.put(signature)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getSignature(id: string): Promise<Signature | null> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['signatures'], 'readonly')
      const store = transaction.objectStore('signatures')
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async getAllSignatures(): Promise<Signature[]> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['signatures'], 'readonly')
      const store = transaction.objectStore('signatures')
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  async deleteSignature(id: string): Promise<void> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['signatures'], 'readwrite')
      const store = transaction.objectStore('signatures')
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // Settings operations
  async saveSettings(settings: any): Promise<void> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readwrite')
      const store = transaction.objectStore('settings')
      const request = store.put({ key: 'userSettings', ...settings })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getSettings(): Promise<any> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly')
      const store = transaction.objectStore('settings')
      const request = store.get('userSettings')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || {})
    })
  }

  // Ensure database is initialized
  private async ensureInit(): Promise<void> {
    if (!this.db) {
      await this.init()
    }
  }

  // Clear all data (for logout/clear data)
  async clearAllData(): Promise<void> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contracts', 'signatures', 'settings', 'cloudSync'], 'readwrite')
      
      transaction.objectStore('contracts').clear()
      transaction.objectStore('signatures').clear()
      transaction.objectStore('settings').clear()
      transaction.objectStore('cloudSync').clear()

      transaction.onerror = () => reject(transaction.error)
      transaction.oncomplete = () => resolve()
    })
  }
}