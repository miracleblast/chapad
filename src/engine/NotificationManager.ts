import { StorageEngine } from './StorageEngine'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  read: boolean
  createdAt: Date
  action?: {
    label: string
    handler: () => void
  }
}

export class NotificationManager {
  private static storage = new StorageEngine()
  private static listeners: ((notification: Notification) => void)[] = []

  static async init() {
    await this.storage.init()
  }

  static async showNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
    const fullNotification: Notification = {
      ...notification,
      id: this.generateId(),
      read: false,
      createdAt: new Date()
    }

    // Notify all listeners
    this.listeners.forEach(listener => listener(fullNotification))

    // Store notification
    await this.storeNotification(fullNotification)
  }

  static async storeNotification(notification: Notification) {
    // Store in localStorage for persistence
    const notifications = this.getStoredNotifications()
    notifications.push(notification)
    localStorage.setItem('chapa_notifications', JSON.stringify(notifications))
  }

  static getStoredNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem('chapa_notifications')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static async markAsRead(notificationId: string) {
    const notifications = this.getStoredNotifications()
    const notification = notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      localStorage.setItem('chapa_notifications', JSON.stringify(notifications))
    }
  }

  static async clearAll() {
    localStorage.removeItem('chapa_notifications')
  }

  static addListener(listener: (notification: Notification) => void) {
    this.listeners.push(listener)
  }

  static removeListener(listener: (notification: Notification) => void) {
    const index = this.listeners.indexOf(listener)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  private static generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Predefined notification templates
  static async contractSigned(contractTitle: string, partyName: string) {
    await this.showNotification({
      type: 'success',
      title: 'Contract Signed',
      message: `${partyName} has signed "${contractTitle}"`,
      action: {
        label: 'View',
        handler: () => {
          // Navigate to contract
          window.dispatchEvent(new CustomEvent('navigate-to-contract', { 
            detail: { contractTitle } 
          }))
        }
      }
    })
  }

  static async contractShared(contractTitle: string) {
    await this.showNotification({
      type: 'info',
      title: 'Contract Shared',
      message: `"${contractTitle}" has been shared for signature`
    })
  }

  static async cloudSaveComplete(provider: string, contractTitle: string) {
    await this.showNotification({
      type: 'success',
      title: 'Cloud Save Complete',
      message: `"${contractTitle}" saved to ${provider}`
    })
  }

  static async error(message: string, title: string = 'Error') {
    await this.showNotification({
      type: 'error',
      title,
      message
    })
  }
}