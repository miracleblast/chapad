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

  // Get contract template based on type - BASE STRUCTURES FOR CUSTOMIZATION
  getContractTemplate(type: string): Partial<Contract> {
    const templates: { [key: string]: Partial<Contract> } = {
      debt: {
        terms: `DEBT AGREEMENT

This Debt Agreement ("Agreement") is made and entered into as of [Date] by and between:

[Lender Name], with address at [Lender Address] ("Lender")

AND

[Borrower Name], with address at [Borrower Address] ("Borrower")

ARTICLE 1 - LOAN TERMS
1.1 LOAN AMOUNT: The Lender agrees to lend the Borrower the sum of [Loan Amount] in [Currency].
1.2 INTEREST RATE: The loan shall bear interest at the rate of [Interest Rate]% per annum.
1.3 REPAYMENT TERMS: The Borrower shall repay the loan in [Number of Installments] installments of [Installment Amount] each.
1.4 PAYMENT SCHEDULE: Payments due on the [Due Day] of each month.
1.5 LATE PAYMENTS: Late payments shall incur a fee of [Late Fee Percentage]% per month.

ARTICLE 2 - DEFAULT AND REMEDIES
2.1 DEFAULT: If the Borrower fails to make any payment when due, the entire outstanding balance shall become immediately due and payable.
2.2 COLLATERAL: [Description of Collateral, if any]
2.3 ACCELERATION: Upon default, the Lender may declare all amounts immediately due.

ARTICLE 3 - REPRESENTATIONS AND WARRANTIES
3.1 The Borrower represents that they have the authority to enter into this Agreement.
3.2 The Lender represents that they have sufficient funds to provide the loan.

ARTICLE 4 - GOVERNING LAW AND JURISDICTION
4.1 This Agreement shall be governed by the laws of [Governing Law Country].
4.2 Any disputes shall be resolved through [Dispute Resolution Method].

ARTICLE 5 - MISCELLANEOUS
5.1 NOTICES: All notices shall be in writing and delivered to the addresses above.
5.2 ENTIRE AGREEMENT: This Agreement constitutes the entire understanding between the parties.
5.3 AMENDMENTS: Any amendments must be in writing and signed by both parties.

IN WITNESS WHEREOF, the parties have executed this Agreement.

LENDER: _________________________
Name: [Lender Representative Name]
Title: [Lender Representative Title]
Date: [Date]

BORROWER: _________________________
Name: [Borrower Representative Name]
Title: [Borrower Representative Title]
Date: [Date]

WITNESS: _________________________
Name: [Witness Name]
Date: [Date]

Generated using ChapaDocs by Harambee`
      },
      sales: {
        terms: `SALES AGREEMENT

This Sales Agreement ("Agreement") is made on [Date] between:

[Seller Name], with address at [Seller Address] ("Seller")

AND

[Buyer Name], with address at [Buyer Address] ("Buyer")

ARTICLE 1 - GOODS AND SPECIFICATIONS
1.1 DESCRIPTION OF GOODS: [Detailed Description of Goods/Services]
1.2 QUANTITY: [Total Quantity] units
1.3 SPECIFICATIONS: [Technical Specifications or Quality Standards]
1.4 PACKAGING: [Packaging Requirements]

ARTICLE 2 - DELIVERY AND ACCEPTANCE
2.1 DELIVERY DATE: Goods shall be delivered on or before [Delivery Date]
2.2 DELIVERY LOCATION: [Delivery Address or Location]
2.3 DELIVERY TERMS: [Incoterms - e.g., FOB, CIF, EXW, DAP]
2.4 RISK OF LOSS: Risk passes to Buyer upon [Risk Transfer Point]
2.5 INSPECTION: Buyer shall have [Inspection Period] days to inspect goods

ARTICLE 3 - PRICE AND PAYMENT
3.1 UNIT PRICE: [Unit Price] [Currency] per unit
3.2 TOTAL PRICE: [Total Price] [Currency]
3.3 PAYMENT TERMS: [Payment Schedule and Method]
3.4 TAXES: [Tax Responsibility and Applicable Taxes]
3.5 LATE PAYMENT: Late payments incur interest at [Late Interest Rate]% per month

ARTICLE 4 - WARRANTIES
4.1 QUALITY WARRANTY: Seller warrants goods are free from defects for [Warranty Period]
4.2 TITLE WARRANTY: Seller warrants they have clear title to the goods
4.3 COMPLIANCE: Goods comply with [Applicable Standards or Regulations]

ARTICLE 5 - INTELLECTUAL PROPERTY
5.1 IP RIGHTS: [Intellectual Property Rights Allocation]
5.2 INDEMNIFICATION: [IP Infringement Indemnification Terms]

ARTICLE 6 - LIMITATION OF LIABILITY
6.1 LIABILITY CAP: Liability limited to [Liability Cap Amount]
6.2 EXCLUSIONS: [Excluded Damages - consequential, indirect, etc.]

ARTICLE 7 - TERMINATION
7.1 TERMINATION FOR CAUSE: Either party may terminate for material breach
7.2 TERMINATION NOTICE: [Notice Period] days written notice required
7.3 EFFECT OF TERMINATION: [Consequences of Termination]

ARTICLE 8 - GOVERNING LAW AND DISPUTES
8.1 GOVERNING LAW: Laws of [Governing Law Country]
8.2 DISPUTE RESOLUTION: [Arbitration, Mediation, or Court Proceedings]
8.3 VENUE: [Jurisdiction for Legal Proceedings]

ARTICLE 9 - GENERAL PROVISIONS
9.1 FORCE MAJEURE: Neither party liable for delays beyond reasonable control
9.2 ASSIGNMENT: [Assignment Rights and Restrictions]
9.3 SEVERABILITY: If any provision is invalid, remainder continues in effect
9.4 WAIVER: Failure to enforce any provision not a waiver of rights
9.5 ENTIRE AGREEMENT: This is the complete understanding between parties

IN WITNESS WHEREOF, the parties have executed this Agreement.

SELLER: _________________________
Name: [Seller Representative Name]
Title: [Seller Representative Title]
Date: [Date]

BUYER: _________________________
Name: [Buyer Representative Name]
Title: [Buyer Representative Title]
Date: [Date]

WITNESS: _________________________
Name: [Witness Name]
Date: [Date]

Generated using ChapaDocs by Harambee`
      },
      service: {
        terms: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is made on [Date] between:

[Service Provider Name], with address at [Provider Address] ("Service Provider")

AND

[Client Name], with address at [Client Address] ("Client")

ARTICLE 1 - SERVICES
1.1 SERVICE DESCRIPTION: [Detailed Description of Services]
1.2 SERVICE STANDARDS: [Quality Standards and Performance Metrics]
1.3 DELIVERABLES: [List of Specific Deliverables]
1.4 TIMELINE: [Service Timeline and Milestones]

ARTICLE 2 - TERM AND TERMINATION
2.1 TERM: This Agreement commences on [Start Date] and continues until [End Date]
2.2 RENEWAL: [Renewal Terms and Conditions]
2.3 TERMINATION FOR CONVENIENCE: Either party may terminate with [Notice Period] notice
2.4 TERMINATION FOR CAUSE: Immediate termination for material breach

ARTICLE 3 - COMPENSATION
3.1 SERVICE FEE: [Fee Amount] [Currency]
3.2 PAYMENT SCHEDULE: [Payment Terms and Schedule]
3.3 EXPENSES: [Reimbursable Expenses Policy]
3.4 TAXES: [Tax Responsibility]

ARTICLE 4 - RELATIONSHIP OF PARTIES
4.1 INDEPENDENT CONTRACTOR: Service Provider is an independent contractor
4.2 NO EMPLOYMENT: No employer-employee relationship created
4.3 BENEFITS: Service Provider not eligible for client benefits

ARTICLE 5 - CONFIDENTIALITY
5.1 CONFIDENTIAL INFORMATION: [Definition of Confidential Information]
5.2 NON-DISCLOSURE: Both parties agree not to disclose confidential information
5.3 EXCEPTIONS: [Exceptions to Confidentiality]
5.4 RETURN OF INFORMATION: Upon termination, return all confidential materials

ARTICLE 6 - INTELLECTUAL PROPERTY
6.1 PRE-EXISTING IP: Each party retains ownership of pre-existing IP
6.2 DEVELOPED IP: [Ownership of IP Developed During Service]
6.3 LICENSE GRANTS: [License Terms for IP Usage]

ARTICLE 7 - REPRESENTATIONS AND WARRANTIES
7.1 AUTHORITY: Both parties have authority to enter this Agreement
7.2 QUALITY: Services will be performed in a professional manner
7.3 COMPLIANCE: Services comply with applicable laws and regulations

ARTICLE 8 - INDEMNIFICATION
8.1 INDEMNIFICATION BY PROVIDER: Provider indemnifies Client for [Covered Claims]
8.2 INDEMNIFICATION BY CLIENT: Client indemnifies Provider for [Covered Claims]

ARTICLE 9 - INSURANCE
9.1 INSURANCE REQUIREMENTS: [Required Insurance Coverage]
9.2 CERTIFICATES: Provide certificates of insurance upon request

ARTICLE 10 - GOVERNING LAW AND DISPUTES
10.1 GOVERNING LAW: Laws of [Governing Law Country]
10.2 DISPUTE RESOLUTION: [Dispute Resolution Process]

IN WITNESS WHEREOF, the parties have executed this Agreement.

SERVICE PROVIDER: _________________________
Name: [Provider Representative Name]
Title: [Provider Representative Title]
Date: [Date]

CLIENT: _________________________
Name: [Client Representative Name]
Title: [Client Representative Title]
Date: [Date]

Generated using ChapaDocs by Harambee`
      },
      partnership: {
        terms: `PARTNERSHIP AGREEMENT

This Partnership Agreement ("Agreement") is made on [Date] between:

[Partner 1 Name], with address at [Partner 1 Address] ("Partner 1")

AND

[Partner 2 Name], with address at [Partner 2 Address] ("Partner 2")

(Collectively referred to as "Partners")

ARTICLE 1 - PARTNERSHIP FORMATION
1.1 PARTNERSHIP NAME: The partnership shall operate as [Partnership Name]
1.2 BUSINESS PURPOSE: [Description of Business Activities]
1.3 PRINCIPAL PLACE OF BUSINESS: [Business Address]
1.4 TERM: Partnership begins on [Start Date] and continues until terminated

ARTICLE 2 - CAPITAL CONTRIBUTIONS
2.1 PARTNER 1 CONTRIBUTION: [Partner 1 Contribution Amount] [Currency] - [Description of Contribution]
2.2 PARTNER 2 CONTRIBUTION: [Partner 2 Contribution Amount] [Currency] - [Description of Contribution]
2.3 ADDITIONAL CONTRIBUTIONS: [Process for Additional Capital Calls]
2.4 CAPITAL ACCOUNTS: Maintain separate capital accounts for each partner

ARTICLE 3 - PROFIT AND LOSS ALLOCATION
3.1 PROFIT SHARING: 
   - Partner 1: [Partner 1 Profit Share]%
   - Partner 2: [Partner 2 Profit Share]%
3.2 LOSS SHARING: Losses allocated in same proportion as profits
3.3 DISTRIBUTIONS: [Distribution Schedule and Process]
3.4 TAX ALLOCATIONS: [Tax Allocation Method]

ARTICLE 4 - MANAGEMENT AND VOTING
4.1 MANAGEMENT RIGHTS: [Management Structure - Equal, Majority, Designated]
4.2 DECISION MAKING: 
   - Routine Decisions: [Approval Process]
   - Major Decisions: [Approval Threshold - Unanimous, Majority]
4.3 MEETINGS: [Meeting Schedule and Procedures]

ARTICLE 5 - PARTNER ROLES AND RESPONSIBILITIES
5.1 PARTNER 1 DUTIES: [Partner 1 Responsibilities]
5.2 PARTNER 2 DUTIES: [Partner 2 Responsibilities]
5.3 TIME COMMITMENT: [Expected Time Commitment from Each Partner]
5.4 OUTSIDE ACTIVITIES: [Policy on Outside Business Activities]

ARTICLE 6 - BOOKS, RECORDS, AND BANKING
6.1 ACCOUNTING: Maintain proper books and records
6.2 FISCAL YEAR: [Fiscal Year End Date]
6.3 BANK ACCOUNTS: [Banking Arrangements and Signatory Authority]
6.4 AUDIT RIGHTS: Each partner has right to inspect books

ARTICLE 7 - PARTNER WITHDRAWAL AND TRANSFER
7.1 VOLUNTARY WITHDRAWAL: [Withdrawal Notice Period and Process]
7.2 INVOLUNTARY WITHDRAWAL: [Grounds for Expulsion]
7.3 TRANSFER OF INTEREST: [Restrictions on Transfer of Partnership Interest]
7.4 BUYOUT TERMS: [Valuation Method and Payment Terms]

ARTICLE 8 - DISSOLUTION AND LIQUIDATION
8.1 DISSOLUTION EVENTS: [Events Causing Dissolution]
8.2 LIQUIDATION: [Liquidation Process]
8.3 ASSET DISTRIBUTION: [Order of Asset Distribution]

ARTICLE 9 - NON-COMPETE AND CONFIDENTIALITY
9.1 NON-COMPETE: [Non-Compete Restrictions During and After Partnership]
9.2 CONFIDENTIALITY: Protect partnership confidential information
9.3 NON-SOLICITATION: [Restrictions on Soliciting Partnership Employees/Clients]

ARTICLE 10 - DISPUTE RESOLUTION
10.1 MEDIATION: Attempt mediation before litigation
10.2 ARBITRATION: [Arbitration Provisions]
10.3 GOVERNING LAW: Laws of [Governing Law Country]

IN WITNESS WHEREOF, the parties have executed this Agreement.

PARTNER 1: _________________________
Name: [Partner 1 Name]
Date: [Date]

PARTNER 2: _________________________
Name: [Partner 2 Name]
Date: [Date]

WITNESS: _________________________
Name: [Witness Name]
Date: [Date]

Generated using ChapaDocs by Harambee`
      },
      'import-export': {
        terms: `IMPORT-EXPORT AGREEMENT

This Import-Export Agreement ("Agreement") is made on [Date] between:

[Exporter Name], a company registered in [Exporter Country] with address at [Exporter Address] ("Exporter")

AND

[Importer Name], a company registered in [Importer Country] with address at [Importer Address] ("Importer")

ARTICLE 1 - PRODUCTS AND SPECIFICATIONS
1.1 PRODUCT DESCRIPTION: [Detailed Product Description]
1.2 TECHNICAL SPECIFICATIONS: [Product Specifications and Standards]
1.3 QUALITY STANDARDS: [Quality Requirements and Testing]
1.4 PACKAGING: [Packaging and Labeling Requirements]

ARTICLE 2 - QUANTITY AND PRICE
2.1 QUANTITY: [Total Quantity] [Units]
2.2 UNIT PRICE: [Unit Price] [Currency]
2.3 TOTAL CONTRACT VALUE: [Total Value] [Currency]
2.4 PRICE TERMS: [Incoterms - FOB, CIF, CFR, EXW, etc.]
2.5 PRICE ADJUSTMENT: [Price Adjustment Mechanism]

ARTICLE 3 - SHIPMENT AND DELIVERY
3.1 PORT OF LOADING: [Loading Port]
3.2 PORT OF DISCHARGE: [Discharge Port]
3.3 SHIPMENT DATE: Latest shipment by [Shipment Date]
3.4 PARTIAL SHIPMENTS: [Allowed/Not Allowed]
3.5 TRANSSHIPMENT: [Allowed/Not Allowed]

ARTICLE 4 - DOCUMENTS REQUIRED
4.1 COMMERCIAL INVOICE: [Invoice Requirements]
4.2 PACKING LIST: [Packing List Requirements]
4.3 CERTIFICATE OF ORIGIN: [Origin Certificate Requirements]
4.4 BILL OF LADING: [B/L Requirements - Clean, On Board]
4.5 INSURANCE CERTIFICATE: [Insurance Requirements]
4.6 INSPECTION CERTIFICATE: [Inspection Requirements]

ARTICLE 5 - PAYMENT TERMS
5.1 PAYMENT METHOD: [Letter of Credit, T/T, D/P, D/A, etc.]
5.2 CURRENCY: [Payment Currency]
5.3 PAYMENT SCHEDULE: [Advance Payment, Against Documents, etc.]
5.4 BANK CHARGES: [Responsibility for Bank Charges]

ARTICLE 6 - INSPECTION AND CLAIMS
6.1 INSPECTION: [Inspection Rights and Procedures]
6.2 QUALITY CLAIMS: [Claim Period and Process]
6.3 QUANTITY CLAIMS: [Claim Period and Process]
6.4 HIDDEN DEFECTS: [Liability for Hidden Defects]

ARTICLE 7 - FORCE MAJEURE
7.1 EVENTS: [Definition of Force Majeure Events]
7.2 NOTICE: [Notice Requirements]
7.3 CONSEQUENCES: [Effects on Contract Performance]

ARTICLE 8 - INSURANCE
8.1 INSURANCE COVERAGE: [Required Insurance Coverage]
8.2 INSURED VALUE: [Insurance Value Calculation]
8.3 CLAIMS: [Insurance Claims Process]

ARTICLE 9 - COMPLIANCE WITH LAWS
9.1 EXPORT COMPLIANCE: Exporter complies with [Exporter Country] export laws
9.2 IMPORT COMPLIANCE: Importer complies with [Importer Country] import laws
9.3 SANCTIONS: Both parties comply with applicable sanctions laws

ARTICLE 10 - GOVERNING LAW AND DISPUTES
10.1 GOVERNING LAW: Laws of [Governing Law Country]
10.2 DISPUTE RESOLUTION: [Arbitration Institution and Rules]
10.3 LANGUAGE: [Contract Language]

IN WITNESS WHEREOF, the parties have executed this Agreement.

EXPORTER: _________________________
For [Exporter Name]
Title: [Exporter Signatory Title]
Date: [Date]

IMPORTER: _________________________
For [Importer Name]
Title: [Importer Signatory Title]
Date: [Date]

Generated using ChapaDocs by Harambee`
      },
      mining: {
        terms: `MINING LICENSE AGREEMENT

This Mining License Agreement ("Agreement") is made on [Date] between:

[Licensor Name], [Description of Licensor Authority] ("Licensor")

AND

[Licensee Name], a company registered in [Licensee Country] with registration number [Registration Number] and address at [Licensee Address] ("Licensee")

RECITALS:
A. Licensor has the authority to grant mining rights in [Jurisdiction]
B. Licensee has the technical and financial capability to conduct mining operations
C. Parties wish to establish terms for mineral exploration and extraction

ARTICLE 1 - GRANT OF RIGHTS
1.1 MINERAL RIGHTS: Licensor grants Licensee exclusive rights to explore and mine [Mineral Types]
1.2 CONTRACT AREA: Area described as [Area Coordinates and Size]
1.3 TERM: Initial term of [Initial Term] years, renewable for [Renewal Term]
1.4 SURFACE RIGHTS: [Surface Access and Usage Rights]

ARTICLE 2 - LICENSEE OBLIGATIONS
2.1 EXPLORATION PROGRAM: [Minimum Exploration Expenditures and Activities]
2.2 DEVELOPMENT PLAN: Submit development plan within [Timeline]
2.3 PRODUCTION REQUIREMENTS: [Minimum Production Levels]
2.4 ENVIRONMENTAL PROTECTION: Implement approved Environmental Management Plan
2.5 COMMUNITY DEVELOPMENT: [Local Community Development Obligations]

ARTICLE 3 - FINANCIAL TERMS
3.1 SIGNATURE BONUS: [Upfront Payment Amount]
3.2 ROYALTIES: [Royalty Rate]% of [Royalty Base - Gross Revenue, Net Smelter Return]
3.3 TAXES: [Tax Obligations and Incentives]
3.4 LOCAL CONTENT: [Local Employment and Procurement Requirements]

ARTICLE 4 - ENVIRONMENTAL AND SOCIAL
4.1 ENVIRONMENTAL BOND: Post bond of [Bond Amount] for environmental protection
4.2 ENVIRONMENTAL STANDARDS: Comply with [Environmental Standards]
4.3 CLOSURE PLAN: Submit and fund mine closure plan
4.4 SOCIAL RESPONSIBILITY: [Community Engagement and Development]

ARTICLE 5 - REPORTING AND MONITORING
5.1 TECHNICAL REPORTS: Submit [Report Frequency] technical reports
5.2 FINANCIAL REPORTS: Submit audited financial statements annually
5.3 PRODUCTION REPORTS: Report production [Monthly/Quarterly]
5.4 GOVERNMENT INSPECTION: Allow government inspection of operations

ARTICLE 6 - DEFAULT AND TERMINATION
6.1 EVENTS OF DEFAULT: [Definition of Default Events]
6.2 CURE PERIOD: [Cure Period for Defaults]
6.3 TERMINATION: [Termination Rights and Procedures]
6.4 POST-TERMINATION OBLIGATIONS: [Obligations After Termination]

ARTICLE 7 - FORCE MAJEURE
7.1 COVERED EVENTS: [Political Unrest, Export Bans, Natural Disasters]
7.2 NOTICE: Notify other party within [Notice Period]
7.3 EXTENSION OF TERM: Term extended for duration of force majeure

ARTICLE 8 - GOVERNING LAW AND DISPUTES
8.1 GOVERNING LAW: Laws of [Host Country]
8.2 STABILIZATION: [Stabilization Clause - if applicable]
8.3 DISPUTE RESOLUTION: [International Arbitration Provisions]
8.4 SOVEREIGN IMMUNITY: [Sovereign Immunity Waiver]

IN WITNESS WHEREOF, the parties have executed this Agreement.

LICENSOR: _________________________
Name: [Licensor Representative Name]
Title: [Licensor Representative Title]
Date: [Date]

LICENSEE: _________________________
For [Licensee Name]
Title: [Licensee Representative Title]
Date: [Date]

WITNESS: _________________________
Name: [Witness Name]
Date: [Date]

Generated using ChapaDocs by Harambee`
      },
      agriculture: {
        terms: `AGRICULTURAL SUPPLY AGREEMENT

This Agricultural Supply Agreement ("Agreement") is made on [Date] between:

[Supplier Name], [Description of Supplier - Cooperative/Farm/Company] with address at [Supplier Address] ("Supplier")

AND

[Buyer Name], with address at [Buyer Address] ("Buyer")

ARTICLE 1 - PRODUCT SPECIFICATIONS
1.1 AGRICULTURAL PRODUCT: [Product Type and Variety]
1.2 QUALITY STANDARDS: [Quality Grades and Specifications]
1.3 CERTIFICATIONS: [Organic, Fair Trade, Sustainability Certifications]
1.4 PACKAGING: [Packaging Requirements and Standards]

ARTICLE 2 - QUANTITY AND DELIVERY
2.1 ANNUAL QUANTITY: [Total Annual Quantity] [Units]
2.2 DELIVERY SCHEDULE: [Delivery Timeline and Frequency]
2.3 DELIVERY LOCATION: [Delivery Points]
2.4 ACCEPTANCE: [Acceptance Criteria and Procedures]

ARTICLE 3 - PRICING AND PAYMENT
3.1 PRICE MECHANISM: [Fixed Price, Market Price, Formula Price]
3.2 PRICE PREMIUMS: [Premiums for Quality, Certifications]
3.3 PAYMENT TERMS: [Payment Schedule and Method]
3.4 PRICE ADJUSTMENT: [Price Review and Adjustment Mechanism]

ARTICLE 4 - QUALITY ASSURANCE
4.1 TESTING: [Quality Testing Procedures]
4.2 REJECTION: [Rejection Rights and Procedures]
4.3 REMEDIES: [Remedies for Quality Issues]
4.4 TRACEABILITY: [Product Traceability Requirements]

ARTICLE 5 - SUSTAINABILITY REQUIREMENTS
5.1 FARMING PRACTICES: [Required Farming Methods]
5.2 ENVIRONMENTAL STANDARDS: [Environmental Protection Requirements]
5.3 LABOR STANDARDS: [Fair Labor Practices]
5.4 ANIMAL WELFARE: [Animal Welfare Standards - if applicable]

ARTICLE 6 - RISK ALLOCATION
6.1 CROP FAILURE: [Allocation of Crop Failure Risk]
6.2 WEATHER RISKS: [Weather-Related Risk Allocation]
6.3 MARKET RISKS: [Market Price Risk Allocation]
6.4 FORCE MAJEURE: [Agricultural Force Majeure Events]

ARTICLE 7 - TERM AND TERMINATION
7.1 TERM: [Contract Duration]
7.2 RENEWAL: [Renewal Options]
7.3 TERMINATION: [Termination Rights and Notice Period]

ARTICLE 8 - GOVERNING LAW
8.1 APPLICABLE LAW: Laws of [Governing Law Country]
8.2 DISPUTE RESOLUTION: [Dispute Resolution Mechanism]

IN WITNESS WHEREOF, the parties have executed this Agreement.

SUPPLIER: _________________________
Name: [Supplier Representative Name]
Title: [Supplier Representative Title]
Date: [Date]

BUYER: _________________________
Name: [Buyer Representative Name]
Title: [Buyer Representative Title]
Date: [Date]

WITNESS: _________________________
Name: [Witness Name]
Date: [Date]

Generated using ChapaDocs by Harambee`
      },
      employment: {
        terms: `EMPLOYMENT CONTRACT

This Employment Contract ("Agreement") is made on [Date] between:

[Employer Name], with address at [Employer Address] ("Employer")

AND

[Employee Name], with address at [Employee Address] ("Employee")

ARTICLE 1 - POSITION AND DUTIES
1.1 POSITION: Employee is employed as [Job Title]
1.2 DUTIES: [Detailed Job Description and Responsibilities]
1.3 REPORTING: Employee reports to [Supervisor Name and Title]
1.4 LOCATION: Primary work location: [Work Address]
1.5 TRAVEL: [Travel Requirements]

ARTICLE 2 - TERM OF EMPLOYMENT
2.1 START DATE: Employment begins on [Start Date]
2.2 PROBATION PERIOD: [Probation Period Duration and Terms]
2.3 CONTRACT DURATION: [Fixed Term/Indefinite Term]
2.4 RENEWAL: [Renewal Terms if Fixed Term]

ARTICLE 3 - COMPENSATION AND BENEFITS
3.1 BASE SALARY: [Salary Amount] [Currency] per [Payment Period]
3.2 PAYMENT SCHEDULE: Salary paid on [Payment Dates]
3.3 BONUS: [Bonus Structure and Eligibility]
3.4 BENEFITS: [Health Insurance, Retirement, Other Benefits]
3.5 EXPENSES: [Expense Reimbursement Policy]

ARTICLE 4 - WORKING HOURS AND LEAVE
4.1 WORKING HOURS: [Standard Working Hours]
4.2 OVERTIME: [Overtime Policy and Compensation]
4.3 ANNUAL LEAVE: [Vacation Days and Accrual]
4.4 SICK LEAVE: [Sick Leave Policy]
4.5 PUBLIC HOLIDAYS: [Holiday Schedule]

ARTICLE 5 - CONFIDENTIALITY AND IP
5.1 CONFIDENTIAL INFORMATION: [Definition of Confidential Information]
5.2 NON-DISCLOSURE: Obligation to protect confidential information
5.3 INTELLECTUAL PROPERTY: [IP Ownership - Work for Hire]
5.4 RETURN OF PROPERTY: Return all company property upon termination

ARTICLE 6 - RESTRICTIVE COVENANTS
6.1 NON-COMPETE: [Non-Compete Restrictions During and After Employment]
6.2 NON-SOLICITATION: [Non-Solicitation of Customers and Employees]
6.3 CONFLICT OF INTEREST: [Conflict of Interest Policy]

ARTICLE 7 - TERMINATION
7.1 NOTICE PERIOD: [Termination Notice Period]
7.2 TERMINATION FOR CAUSE: [Grounds for Immediate Termination]
7.3 SEVERANCE: [Severance Pay Terms]
7.4 EXIT INTERVIEW: [Exit Procedures]

ARTICLE 8 - GOVERNING LAW
8.1 APPLICABLE LAW: Laws of [Governing Law Country]
8.2 DISPUTE RESOLUTION: [Grievance and Dispute Process]

IN WITNESS WHEREOF, the parties have executed this Agreement.

EMPLOYER: _________________________
Name: [Employer Representative Name]
Title: [Employer Representative Title]
Date: [Date]

EMPLOYEE: _________________________
Name: [Employee Name]
Date: [Date]

WITNESS: _________________________
Name: [Witness Name]
Date: [Date]

Generated using ChapaDocs by Harambee`
      },
      nda: {
        terms: `CONFIDENTIALITY AGREEMENT (NDA)

This Confidentiality Agreement ("Agreement") is made on [Date] between:

[Disclosing Party Name], with address at [Disclosing Party Address] ("Disclosing Party")

AND

[Receiving Party Name], with address at [Receiving Party Address] ("Receiving Party")

ARTICLE 1 - DEFINITIONS
1.1 CONFIDENTIAL INFORMATION: Means any information disclosed by Disclosing Party to Receiving Party, including but not limited to:
   - [Specific Categories of Confidential Information]
   - [Technical, Business, Financial Information]
   - [Customer Lists, Marketing Plans, Trade Secrets]
1.2 EXCLUDED INFORMATION: Information that:
   - Was publicly known at time of disclosure
   - Becomes publicly known through no fault of Receiving Party
   - Was rightfully in Receiving Party's possession prior to disclosure
   - Is independently developed by Receiving Party
   - Is rightfully obtained from third parties without restriction

ARTICLE 2 - OBLIGATIONS
2.1 NON-DISCLOSURE: Receiving Party shall not disclose Confidential Information to any third party
2.2 NON-USE: Receiving Party shall not use Confidential Information for any purpose except [Permitted Purpose]
2.3 PROTECTION: Receiving Party shall protect Confidential Information with same degree of care as its own confidential information
2.4 LIMITED ACCESS: Limit access to employees who need to know for [Permitted Purpose]

ARTICLE 3 - PERMITTED DISCLOSURES
3.1 LEGAL REQUIREMENTS: Disclosure required by law, court order, or government regulation
3.2 NOTICE: Provide Disclosing Party with advance notice of required disclosure
3.3 COOPERATION: Cooperate with Disclosing Party to contest or limit disclosure

ARTICLE 4 - TERM AND RETURN
4.1 TERM: This Agreement remains in effect for [Term Duration] from effective date
4.2 RETURN OF INFORMATION: Upon termination, return or destroy all Confidential Information
4.3 SURVIVAL: Confidentiality obligations survive termination of this Agreement

ARTICLE 5 - REMEDIES
5.1 INJUNCTIVE RELIEF: Both parties acknowledge that breach would cause irreparable harm
5.2 ATTORNEY FEES: Prevailing party in enforcement action entitled to recover costs
5.3 CUMULATIVE REMEDIES: All remedies cumulative, not exclusive

ARTICLE 6 - GENERAL PROVISIONS
6.1 NO LICENSE: No license to any intellectual property granted under this Agreement
6.2 NO WARRANTY: Confidential Information provided "AS IS" without warranty
6.3 ASSIGNMENT: [Assignment Restrictions]
6.4 GOVERNING LAW: Laws of [Governing Law Country]
6.5 ENTIRE AGREEMENT: This is the complete understanding between parties

IN WITNESS WHEREOF, the parties have executed this Agreement.

DISCLOSING PARTY: _________________________
Name: [Disclosing Party Representative]
Title: [Disclosing Party Title]
Date: [Date]

RECEIVING PARTY: _________________________
Name: [Receiving Party Representative]
Title: [Receiving Party Title]
Date: [Date]

Generated using ChapaDocs by Harambee`
      }
    }

    return templates[type] || { 
      terms: `CUSTOM CONTRACT AGREEMENT

This Agreement ("Agreement") is made on [Date] between:

[First Party Name], with address at [First Party Address] ("First Party")

AND

[Second Party Name], with address at [Second Party Address] ("Second Party")

ARTICLE 1 - PURPOSE AND SCOPE
1.1 PURPOSE: This Agreement governs the relationship between the parties regarding [Business Purpose].
1.2 SCOPE: [Detailed Description of Agreement Scope]

ARTICLE 2 - OBLIGATIONS OF PARTIES
2.1 FIRST PARTY OBLIGATIONS: [First Party Responsibilities and Deliverables]
2.2 SECOND PARTY OBLIGATIONS: [Second Party Responsibilities and Deliverables]
2.3 TIMELINE: [Performance Timeline and Milestones]

ARTICLE 3 - COMPENSATION AND PAYMENT
3.1 COMPENSATION: [Payment Amounts, Schedule, and Method]
3.2 EXPENSES: [Expense Reimbursement Policy]
3.3 TAXES: [Tax Responsibility]

ARTICLE 4 - TERM AND TERMINATION
4.1 TERM: This Agreement begins on [Start Date] and continues until [End Date]
4.2 TERMINATION: [Termination Rights and Notice Period]
4.3 EFFECT OF TERMINATION: [Consequences of Termination]

ARTICLE 5 - CONFIDENTIALITY
5.1 CONFIDENTIAL INFORMATION: [Definition of Confidential Information]
5.2 NON-DISCLOSURE: Both parties agree to maintain confidentiality
5.3 EXCEPTIONS: [Permitted Disclosures]

ARTICLE 6 - INTELLECTUAL PROPERTY
6.1 PRE-EXISTING IP: Each party retains ownership of their pre-existing IP
6.2 DEVELOPED IP: [Ownership of IP Developed Under This Agreement]

ARTICLE 7 - LIMITATION OF LIABILITY
7.1 LIABILITY CAP: Liability limited to [Liability Cap Amount]
7.2 EXCLUDED DAMAGES: [Exclusion of Consequential, Indirect Damages]

ARTICLE 8 - INDEMNIFICATION
8.1 INDEMNIFICATION: [Mutual Indemnification Terms]

ARTICLE 9 - GOVERNING LAW AND DISPUTES
9.1 GOVERNING LAW: Laws of [Governing Law Country]
9.2 DISPUTE RESOLUTION: [Dispute Resolution Process]

ARTICLE 10 - MISCELLANEOUS
10.1 NOTICES: [Notice Requirements and Addresses]
10.2 ASSIGNMENT: [Assignment Rights and Restrictions]
10.3 SEVERABILITY: If any provision invalid, remainder continues
10.4 WAIVER: Failure to enforce not a waiver of rights
10.5 ENTIRE AGREEMENT: This is the complete understanding between parties
10.6 AMENDMENTS: Amendments must be in writing and signed

IN WITNESS WHEREOF, the parties have executed this Agreement.

FIRST PARTY: _________________________
Name: [First Party Representative Name]
Title: [First Party Representative Title]
Date: [Date]

SECOND PARTY: _________________________
Name: [Second Party Representative Name]
Title: [Second Party Representative Title]
Date: [Date]

WITNESS: _________________________
Name: [Witness Name]
Date: [Date]

Generated using ChapaDocs by Harambee`
    }
  }
}