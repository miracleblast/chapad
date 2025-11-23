import { defineStore } from 'pinia'
import { StorageEngine } from '@/utils/storage'
import { NotificationManager } from '@/engine/NotificationManager' // ADD THIS

export const useAppStore = defineStore('app', {
  state: () => ({
    // Theme
    isDarkMode: false,
    
    // Language
    language: 'en',
    
    // Settings
    settings: {
      vibration: true,
      sound: true,
      autoSave: true,
      autoBackup: false
    },
    
    // App state
    isLoading: false,
    isInitialized: false,
    error: null as string | null
  }),

  getters: {
    // Check if app is ready
    isReady: (state) => state.isInitialized && !state.isLoading,
    
    // Get current theme
    currentTheme: (state) => state.isDarkMode ? 'dark' : 'light'
  },

  actions: {
    async initialize() {
      this.isLoading = true
      try {
        const storage = new StorageEngine()
        await storage.init()
        
        // Load settings from storage
        const savedSettings = await storage.getSettings()
        if (savedSettings) {
          this.settings = { ...this.settings, ...savedSettings }
        }
        
        // Load theme preference
        const savedTheme = localStorage.getItem('chapa-theme')
        this.isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
        
        // Load language preference
        const savedLanguage = localStorage.getItem('chapa-language')
        this.language = savedLanguage || 'en'
        
        // Apply theme to document
        this.applyTheme()
        
        this.isInitialized = true
        
        // NEW: Show welcome notification
        setTimeout(() => {
          NotificationManager.showNotification({
            type: 'info',
            title: 'Welcome to ChapaDocs',
            message: 'Your contract management assistant is ready!'
          })
        }, 1000)
        
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to initialize app'
        console.error('App initialization error:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Theme management
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      this.applyTheme()
      localStorage.setItem('chapa-theme', this.isDarkMode ? 'dark' : 'light')
      
      // NEW: Show notification
      NotificationManager.showNotification({
        type: 'info',
        title: 'Theme Changed',
        message: `Switched to ${this.isDarkMode ? 'dark' : 'light'} mode`
      })
    },

    setDarkMode(isDark: boolean) {
      this.isDarkMode = isDark
      this.applyTheme()
      localStorage.setItem('chapa-theme', isDark ? 'dark' : 'light')
    },

    applyTheme() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    // Language management
    setLanguage(lang: string) {
      this.language = lang
      localStorage.setItem('chapa-language', lang)
      
      // NEW: Show notification
      NotificationManager.showNotification({
        type: 'info',
        title: 'Language Changed',
        message: `App language set to ${lang}`
      })
    },

    // Settings management
    updateSettings(newSettings: Partial<typeof this.settings>) {
      this.settings = { ...this.settings, ...newSettings }
      this.saveSettings()
    },

    toggleSetting(setting: keyof typeof this.settings) {
  this.settings[setting] = !this.settings[setting]
  this.saveSettings()
  
  // NEW: Show notification
  NotificationManager.showNotification({
    type: 'info',
    title: 'Setting Updated',
    message: `${String(setting)} ${this.settings[setting] ? 'enabled' : 'disabled'}` // ADD String() wrapper
  })
},

    async saveSettings() {
      try {
        const storage = new StorageEngine()
        await storage.saveSettings(this.settings)
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    },

    // Error management
    setError(error: string | null) {
      this.error = error
      if (error) {
        // NEW: Show error notification
        NotificationManager.showNotification({
          type: 'error',
          title: 'Error',
          message: error
        })
      }
    },

    clearError() {
      this.error = null
    },

    // Reset app (for logout/clear data)
    async reset() {
      this.isLoading = true
      try {
        const storage = new StorageEngine()
        await storage.clearAllData()
        
        // Reset state to defaults
        this.isDarkMode = false
        this.language = 'en'
        this.settings = {
          vibration: true,
          sound: true,
          autoSave: true,
          autoBackup: false
        }
        this.isInitialized = false
        this.error = null
        
        // Clear local storage
        localStorage.removeItem('chapa-theme')
        localStorage.removeItem('chapa-language')
        
        // Re-apply theme
        this.applyTheme()
        
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to reset app'
      } finally {
        this.isLoading = false
      }
    }
  }
})