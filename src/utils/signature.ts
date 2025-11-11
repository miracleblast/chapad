export interface Signature {
  id: string
  contractId: string
  party: 'firstParty' | 'secondParty' | 'witness'
  type: 'draw' | 'text' | 'image'
  data: string // base64 for images, text for typed
  createdAt: string
  ipAddress?: string
  userAgent?: string
}

export class SignatureEngine {
  private storage: StorageEngine

  constructor() {
    this.storage = new StorageEngine()
  }

  // Generate unique signature ID
  private generateId(): string {
    return `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Create signature from drawing (canvas)
  async createDrawingSignature(contractId: string, party: 'firstParty' | 'secondParty', canvas: HTMLCanvasElement): Promise<Signature> {
    const signatureData = canvas.toDataURL('image/png')
    
    const signature: Signature = {
      id: this.generateId(),
      contractId,
      party,
      type: 'draw',
      data: signatureData,
      createdAt: new Date().toISOString(),
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent
    }

    await this.saveSignature(signature)
    return signature
  }

  // Create signature from text
  async createTextSignature(contractId: string, party: 'firstParty' | 'secondParty', text: string): Promise<Signature> {
    const signature: Signature = {
      id: this.generateId(),
      contractId,
      party,
      type: 'text',
      data: text,
      createdAt: new Date().toISOString(),
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent
    }

    await this.saveSignature(signature)
    return signature
  }

  // Create signature from uploaded image
  async createImageSignature(contractId: string, party: 'firstParty' | 'secondParty', file: File): Promise<Signature> {
    // Validate file size (max 500KB)
    if (file.size > 500 * 1024) {
      throw new Error('Signature image must be less than 500KB')
    }

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      throw new Error('Signature must be PNG or JPEG image')
    }

    const signatureData = await this.fileToBase64(file)
    
    const signature: Signature = {
      id: this.generateId(),
      contractId,
      party,
      type: 'image',
      data: signatureData,
      createdAt: new Date().toISOString(),
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent
    }

    await this.saveSignature(signature)
    return signature
  }

  // Get signatures for a contract
  async getSignaturesForContract(contractId: string): Promise<Signature[]> {
    const allSignatures = await this.storage.getAllSignatures()
    return allSignatures.filter(sig => sig.contractId === contractId)
  }

  // Delete signature
  async deleteSignature(signatureId: string): Promise<void> {
    await this.storage.deleteSignature(signatureId)
  }

  // Validate signature data
  validateSignature(signature: Partial<Signature>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!signature.contractId) {
      errors.push('Contract ID is required')
    }

    if (!signature.party) {
      errors.push('Signature party is required')
    }

    if (!signature.data) {
      errors.push('Signature data is required')
    }

    if (signature.type === 'image') {
      // Basic base64 validation for images
      if (!signature.data.startsWith('data:image/')) {
        errors.push('Invalid image signature format')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Get client IP (simplified for PWA)
  private async getClientIP(): Promise<string> {
    try {
      // For PWAs, we can't reliably get client IP without backend
      // This is a simplified version that works offline
      return 'local-' + Math.random().toString(36).substr(2, 8)
    } catch {
      return 'unknown'
    }
  }

  // Convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Save signature to storage
  private async saveSignature(signature: Signature): Promise<void> {
    await this.storage.saveSignature(signature)
  }
}