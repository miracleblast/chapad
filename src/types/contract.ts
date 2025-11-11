export interface Contract {
  id: string
  title: string
  type: string
  slug: string
  parties: ContractParties
  jurisdiction: ContractJurisdiction
  terms: string
  clauses: string[]
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  signatures: ContractSignatures
}

export interface ContractParties {
  firstParty: ContractParty
  secondParty: ContractParty
}

export interface ContractParty {
  name: string
  address?: string
  contact?: string
  email?: string
  phone?: string
}

export interface ContractJurisdiction {
  firstCountry: string
  secondCountry: string
  currency: string
  language?: string
}

export interface ContractSignatures {
  firstParty?: ContractSignature
  secondParty?: ContractSignature
  witnesses?: ContractSignature[]
}

export interface ContractSignature {
  signature: string // base64 image or text
  signedAt: string
  ipAddress?: string
  userAgent?: string
}

export interface ContractTemplate {
  id: string
  name: string
  type: string
  description: string
  content: string
  fields: TemplateField[]
  isPublic: boolean
  createdBy: string
  createdAt: string
}

export interface TemplateField {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea'
  required: boolean
  options?: string[]
  placeholder?: string
}