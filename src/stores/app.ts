import { defineStore } from 'pinia'
import { StorageEngine } from '@/utils/storage'

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
      // In a real app, you'd update vue-i18n here
    },

    // Settings management
    updateSettings(newSettings: Partial<typeof this.settings>) {
      this.settings = { ...this.settings, ...newSettings }
      this.saveSettings()
    },

    toggleSetting(setting: keyof typeof this.settings) {
      this.settings[setting] = !this.settings[setting]
      this.saveSettings()
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