import { StorageEngine } from './StorageEngine'
import { CloudStorageManager } from './CloudStorageManager'
import { NotificationManager } from './NotificationManager'

export class AppInitializer {
  private static initialized = false

  static async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('🔄 App already initialized')
      return
    }

    try {
      console.log('🚀 Starting ChapaDocs engine initialization...')
      
      // Initialize new systems that work alongside your existing engines
      console.log('📦 Initializing Enhanced Storage Engine...')
      const storageEngine = new StorageEngine() // CREATE INSTANCE
      await storageEngine.init() // CALL INSTANCE METHOD
      
      console.log('☁️ Initializing Cloud Storage Manager...')
      await CloudStorageManager.init()
      
      console.log('🔔 Initializing Notification Manager...')
      await NotificationManager.init()
      
      this.initialized = true
      console.log('🎉 New engines initialized successfully!')
      
    } catch (error) {
      console.error('💥 Engine initialization failed:', error)
      // Don't throw - let the app continue with existing engines
    }
  }

  static isInitialized(): boolean {
    return this.initialized
  }
}