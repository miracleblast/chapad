import { StorageEngine } from './storage'

export interface Contract {
  id: string
  title: string
  type: string
  slug: string
  parties: {
    firstParty: { name: string; address?: string; contact?: string }
    secondParty: { name: string; address?: string; contact?: string }
  }
  jurisdiction: {
    firstCountry: string
    secondCountry: string
    currency: string
  }
  terms: string
  clauses: string[]
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  signatures: {
    firstParty?: { signature: string; signedAt: string }
    secondParty?: { signature: string; signedAt: string }
  }
}

export class ContractEngine {
  private storage: StorageEngine

  constructor() {
    this.storage = new StorageEngine()
  }

  // Generate unique contract ID
  private generateId(): string {
    return `ctr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Create new contract
  async createContract(data: Partial<Contract>): Promise<Contract> {
    const contract: Contract = {
      id: this.generateId(),
      title: data.title || 'Untitled Contract',
      type: data.type || 'custom',
      slug: data.slug || this.generateSlug(data.title || 'Untitled Contract'),
      parties: data.parties || {
        firstParty: { name: '' },
        secondParty: { name: '' }
      },
      jurisdiction: data.jurisdiction || {
        firstCountry: '',
        secondCountry: '',
        currency: ''
      },
      terms: data.terms || '',
      clauses: data.clauses || [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      signatures: {}
    }

    // Save to local storage
    await this.storage.saveContract(contract)
    return contract
  }

  // Update existing contract
  async updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
    const contract = await this.storage.getContract(id)
    if (!contract) {
      throw new Error('Contract not found')
    }

    const updatedContract: Contract = {
      ...contract,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await this.storage.saveContract(updatedContract)
    return updatedContract
  }

  // Get contract by ID
  async getContract(id: string): Promise<Contract | null> {
    return await this.storage.getContract(id)
  }

  // Get all contracts
  async getAllContracts(): Promise<Contract[]> {
    return await this.storage.getAllContracts()
  }

  // Delete contract
  async deleteContract(id: string): Promise<void> {
    await this.storage.deleteContract(id)
  }

  // Generate slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .substring(0, 50)
  }

  // Validate contract data
  validateContract(data: Partial<Contract>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.title?.trim()) {
      errors.push('Contract title is required')
    }

    if (!data.parties?.firstParty?.name?.trim()) {
      errors.push('First party name is required')
    }

    if (!data.parties?.secondParty?.name?.trim()) {
      errors.push('Second party name is required')
    }

    if (!data.jurisdiction?.currency) {
      errors.push('Currency is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Get contract template based on type
  getContractTemplate(type: string): Partial<Contract> {
    const templates: { [key: string]: Partial<Contract> } = {
      debt: {
        terms: `DEBT AGREEMENT

This Debt Agreement ("Agreement") is made and entered into as of [Date] by and between:

[First Party Name], located at [Address] ("Lender")

AND

[Second Party Name], located at [Address] ("Borrower")

1. LOAN AMOUNT: The Lender agrees to lend the Borrower the sum of [Amount] in [Currency].

2. INTEREST RATE: The loan shall bear interest at the rate of [Interest Rate]% per annum.

3. REPAYMENT TERMS: The Borrower shall repay the loan in [Number] installments of [Installment Amount] each, due on the [Day] of each month.

4. DEFAULT: If the Borrower fails to make any payment when due, the entire outstanding balance shall become immediately due and payable.

5. GOVERNING LAW: This Agreement shall be governed by the laws of [Country].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

LENDER: _________________________
BORROWER: _________________________
WITNESS: _________________________`
      },
      sales: {
        terms: `SALES AGREEMENT

This Sales Agreement ("Agreement") is made on [Date] between:

[First Party Name] ("Seller")

AND

[Second Party Name] ("Buyer")

1. GOODS: The Seller agrees to sell and the Buyer agrees to purchase the following goods: [Description of Goods].

2. PRICE: The total purchase price shall be [Amount] [Currency].

3. DELIVERY: The goods shall be delivered to [Delivery Address] on or before [Delivery Date].

4. PAYMENT: The Buyer shall pay the Seller [Payment Terms].

5. WARRANTY: The Seller warrants that the goods are free from defects in material and workmanship.

IN WITNESS WHEREOF, the parties have executed this Agreement.

SELLER: _________________________
BUYER: _________________________
DATE: _________________________`
      }
    }

    return templates[type] || { terms: '' }
  }
}