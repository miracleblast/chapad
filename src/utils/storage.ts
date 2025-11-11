import { Contract } from './contracts'

export class StorageEngine {
  private dbName = 'ChapaDocsDB'
  private version = 1
  private db: IDBDatabase | null = null
// Add to your existing StorageEngine class in /src/utils/storage.ts

// Signature operations
async saveSignature(signature: any): Promise<void> {
  await this.ensureInit()
  return new Promise((resolve, reject) => {
    const transaction = this.db!.transaction(['signatures'], 'readwrite')
    const store = transaction.objectStore('signatures')
    const request = store.put(signature)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

async getSignature(id: string): Promise<any> {
  await this.ensureInit()
  return new Promise((resolve, reject) => {
    const transaction = this.db!.transaction(['signatures'], 'readonly')
    const store = transaction.objectStore('signatures')
    const request = store.get(id)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || null)
  })
}

async getAllSignatures(): Promise<any[]> {
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
          store.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
      }
    })
  }

  // Contract operations
  async saveContract(contract: Contract): Promise<void> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contracts'], 'readwrite')
      const store = transaction.objectStore('contracts')
      const request = store.put(contract)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getContract(id: string): Promise<Contract | null> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contracts'], 'readonly')
      const store = transaction.objectStore('contracts')
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async getAllContracts(): Promise<Contract[]> {
    await this.ensureInit()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contracts'], 'readonly')
      const store = transaction.objectStore('contracts')
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

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
      const transaction = this.db!.transaction(['contracts', 'settings'], 'readwrite')
      
      transaction.objectStore('contracts').clear()
      transaction.objectStore('settings').clear()

      transaction.onerror = () => reject(transaction.error)
      transaction.oncomplete = () => resolve()
    })
  }
}