export interface ContractTemplate {
  id: string
  title: string
  type: string
  description: string
  jurisdiction: string
  content: string
  fields: TemplateField[]
  contributor?: {
    name: string
    firm?: string
    contact?: string
  }
  isOfficial: boolean
  downloads: number
  rating: number
  createdAt: string
}

export interface TemplateField {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea'
  required: boolean
  placeholder?: string
  options?: string[]
}

export class TemplateEngine {
  // Get all templates
  static getAllTemplates(): ContractTemplate[] {
    return [
      // DEBT AGREEMENTS
      {
        id: 'debt-ng-standard',
        title: 'Nigeria Standard Debt Agreement',
        type: 'debt',
        description: 'Simple loan agreement for Nigerian jurisdiction with flexible repayment terms',
        jurisdiction: 'NG',
        content: `DEBT AGREEMENT

This Debt Agreement ("Agreement") is made and entered into as of [Date] by and between:

[Lender Name], with address at [Lender Address] ("Lender")

AND

[Borrower Name], with address at [Borrower Address] ("Borrower")

1. LOAN AMOUNT: The Lender agrees to lend the Borrower the sum of [Loan Amount] in [Currency].

2. INTEREST RATE: The loan shall bear interest at the rate of [Interest Rate]% per annum.

3. REPAYMENT TERMS: The Borrower shall repay the loan in [Number of Installments] monthly installments of [Installment Amount] each, due on the [Due Day] of each month.

4. DEFAULT: If the Borrower fails to make any payment when due, the entire outstanding balance shall become immediately due and payable.

5. GOVERNING LAW: This Agreement shall be governed by the laws of Nigeria.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

LENDER: _________________________
Name: [Lender Name]
Date: [Date]

BORROWER: _________________________
Name: [Borrower Name]  
Date: [Date]

WITNESS: _________________________
Name: [Witness Name]
Date: [Date]`,
        fields: [
          { key: 'Date', label: 'Agreement Date', type: 'date', required: true },
          { key: 'Lender Name', label: 'Lender Full Name', type: 'text', required: true },
          { key: 'Lender Address', label: 'Lender Address', type: 'text', required: true },
          { key: 'Borrower Name', label: 'Borrower Full Name', type: 'text', required: true },
          { key: 'Borrower Address', label: 'Borrower Address', type: 'text', required: true },
          { key: 'Loan Amount', label: 'Loan Amount', type: 'number', required: true },
          { key: 'Currency', label: 'Currency', type: 'select', required: true, options: ['NGN', 'USD', 'EUR'] },
          { key: 'Interest Rate', label: 'Interest Rate (%)', type: 'number', required: false },
          { key: 'Number of Installments', label: 'Number of Installments', type: 'number', required: true },
          { key: 'Installment Amount', label: 'Installment Amount', type: 'number', required: true },
          { key: 'Due Day', label: 'Payment Due Day', type: 'number', required: true, placeholder: 'e.g., 15 (for 15th of each month)' }
        ],
        isOfficial: true,
        downloads: 0,
        rating: 4.8,
        createdAt: new Date().toISOString()
      },
      {
        id: 'debt-cn-africa',
        title: 'China-Africa Business Loan Agreement',
        type: 'debt',
        description: 'Loan agreement for Chinese businesses lending to African partners',
        jurisdiction: 'CN',
        content: `CHINA-AFRICA BUSINESS LOAN AGREEMENT

This China-Africa Business Loan Agreement ("Agreement") is made on [Date] between:

[Chinese Company Name], a company incorporated under the laws of China with its principal office at [Chinese Company Address] ("Lender")

AND

[African Company Name], a company incorporated under the laws of [African Country] with its principal office at [African Company Address] ("Borrower")

ARTICLE 1 - LOAN FACILITY
1.1 The Lender agrees to provide a loan facility of [Loan Amount] CNY to the Borrower.
1.2 The loan shall be used exclusively for [Business Purpose].

ARTICLE 2 - INTEREST AND REPAYMENT
2.1 The annual interest rate shall be [Interest Rate]%.
2.2 Repayment shall be made in [Number of Installments] equal quarterly installments.
2.3 All payments shall be made in CNY to the Lender's designated bank account.

ARTICLE 3 - REPRESENTATIONS
3.1 The Borrower represents that it is duly organized and validly existing under the laws of [African Country].
3.2 The Lender represents that it has all necessary approvals from Chinese authorities for this transaction.

ARTICLE 4 - GOVERNING LAW AND DISPUTES
4.1 This Agreement shall be governed by Chinese law.
4.2 Any disputes shall be settled through friendly consultation or submitted to China International Economic and Trade Arbitration Commission.

IN WITNESS WHEREOF, the parties have executed this Agreement.

LENDER: _________________________
For [Chinese Company Name]
Title: [Authorized Signatory Title]

BORROWER: _________________________
For [African Company Name] 
Title: [Authorized Signatory Title]

DATE: [Date]`,
        fields: [
          { key: 'Date', label: 'Agreement Date', type: 'date', required: true },
          { key: 'Chinese Company Name', label: 'Chinese Company Name', type: 'text', required: true },
          { key: 'Chinese Company Address', label: 'Chinese Company Address', type: 'text', required: true },
          { key: 'African Company Name', label: 'African Company Name', type: 'text', required: true },
          { key: 'African Company Address', label: 'African Company Address', type: 'text', required: true },
          { key: 'African Country', label: 'African Country', type: 'text', required: true },
          { key: 'Loan Amount', label: 'Loan Amount (CNY)', type: 'number', required: true },
          { key: 'Business Purpose', label: 'Business Purpose', type: 'textarea', required: true },
          { key: 'Interest Rate', label: 'Interest Rate (%)', type: 'number', required: true },
          { key: 'Number of Installments', label: 'Number of Installments', type: 'number', required: true },
          { key: 'Authorized Signatory Title', label: 'Signatory Title', type: 'text', required: true }
        ],
        isOfficial: true,
        downloads: 0,
        rating: 4.7,
        createdAt: new Date().toISOString()
      },

      // SALES AGREEMENTS
      {
        id: 'sales-ke-standard',
        title: 'Kenya Goods Sales Agreement',
        type: 'sales',
        description: 'Standard sales agreement for goods in Kenyan market',
        jurisdiction: 'KE',
        content: `GOODS SALES AGREEMENT

This Sales Agreement ("Agreement") is made on [Date] between:

[Seller Name], with business address at [Seller Address] ("Seller")

AND

[Buyer Name], with business address at [Buyer Address] ("Buyer")

1. GOODS DESCRIPTION: The Seller agrees to sell and the Buyer agrees to purchase the following goods: [Goods Description].

2. QUANTITY AND PRICE: 
   - Quantity: [Quantity]
   - Unit Price: [Unit Price] KES
   - Total Price: [Total Price] KES

3. DELIVERY:
   - Delivery Date: [Delivery Date]
   - Delivery Location: [Delivery Location]
   - Risk of loss passes to Buyer upon delivery.

4. PAYMENT TERMS:
   - [Payment Terms Description]
   - Payment due within [Payment Days] days of invoice date.

5. KENYAN LAW: This Agreement shall be governed by the laws of Kenya.

6. TAXES: All applicable Kenyan taxes including VAT shall be borne by [Tax Responsibility].

SIGNATURES:

SELLER: _________________________
Name: [Seller Representative]
Title: [Seller Title]

BUYER: _________________________
Name: [Buyer Representative]  
Title: [Buyer Title]

DATE: [Date]`,
        fields: [
          { key: 'Date', label: 'Agreement Date', type: 'date', required: true },
          { key: 'Seller Name', label: 'Seller Company Name', type: 'text', required: true },
          { key: 'Seller Address', label: 'Seller Address', type: 'text', required: true },
          { key: 'Buyer Name', label: 'Buyer Company Name', type: 'text', required: true },
          { key: 'Buyer Address', label: 'Buyer Address', type: 'text', required: true },
          { key: 'Goods Description', label: 'Goods Description', type: 'textarea', required: true },
          { key: 'Quantity', label: 'Quantity', type: 'number', required: true },
          { key: 'Unit Price', label: 'Unit Price (KES)', type: 'number', required: true },
          { key: 'Total Price', label: 'Total Price (KES)', type: 'number', required: true },
          { key: 'Delivery Date', label: 'Delivery Date', type: 'date', required: true },
          { key: 'Delivery Location', label: 'Delivery Location', type: 'text', required: true },
          { key: 'Payment Terms Description', label: 'Payment Terms', type: 'textarea', required: true },
          { key: 'Payment Days', label: 'Payment Due Days', type: 'number', required: true },
          { key: 'Tax Responsibility', label: 'Tax Responsibility', type: 'select', required: true, options: ['Seller', 'Buyer'] },
          { key: 'Seller Representative', label: 'Seller Representative Name', type: 'text', required: true },
          { key: 'Seller Title', label: 'Seller Title', type: 'text', required: true },
          { key: 'Buyer Representative', label: 'Buyer Representative Name', type: 'text', required: true },
          { key: 'Buyer Title', label: 'Buyer Title', type: 'text', required: true }
        ],
        isOfficial: true,
        downloads: 0,
        rating: 4.6,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sales-in-africa',
        title: 'India-Africa Export Sales Agreement',
        type: 'sales',
        description: 'Export sales agreement for Indian companies selling to African markets',
        jurisdiction: 'IN',
        content: `INDIA-AFRICA EXPORT SALES AGREEMENT

This Export Sales Agreement ("Agreement") is made on [Date] between:

[Indian Exporter Name], an Indian company having its registered office at [Indian Company Address] ("Exporter")

AND

[African Importer Name], a company registered in [African Country] having its office at [African Company Address] ("Importer")

1. PRODUCTS: The Exporter shall supply the following products: [Product Description].

2. SPECIFICATIONS: Products shall conform to specifications: [Product Specifications].

3. QUANTITY AND PRICE:
   - Total Quantity: [Total Quantity] [Units]
   - Unit Price: [Unit Price] USD
   - Total Contract Value: [Total Value] USD
   - Price Terms: [Incoterms]

4. SHIPMENT:
   - Port of Loading: [Indian Port]
   - Port of Discharge: [African Port]
   - Latest Shipment Date: [Shipment Date]

5. PAYMENT: 
   - Payment Method: [Payment Method]
   - Advance Payment: [Advance Percentage]% upon signing
   - Balance Payment: Against shipping documents

6. INSPECTION: Goods shall be inspected at [Inspection Location] before shipment.

7. GOVERNING LAW: This Agreement shall be governed by Indian law.

8. FORCE MAJEURE: Neither party shall be liable for delays due to circumstances beyond reasonable control.

EXPORTER: _________________________
For [Indian Exporter Name]
Title: [Exporter Signatory Title]

IMPORTER: _________________________
For [African Importer Name]
Title: [Importer Signatory Title]

DATE: [Date]`,
        fields: [
          { key: 'Date', label: 'Agreement Date', type: 'date', required: true },
          { key: 'Indian Exporter Name', label: 'Indian Exporter Name', type: 'text', required: true },
          { key: 'Indian Company Address', label: 'Indian Company Address', type: 'text', required: true },
          { key: 'African Importer Name', label: 'African Importer Name', type: 'text', required: true },
          { key: 'African Company Address', label: 'African Company Address', type: 'text', required: true },
          { key: 'African Country', label: 'African Country', type: 'text', required: true },
          { key: 'Product Description', label: 'Product Description', type: 'textarea', required: true },
          { key: 'Product Specifications', label: 'Product Specifications', type: 'textarea', required: true },
          { key: 'Total Quantity', label: 'Total Quantity', type: 'number', required: true },
          { key: 'Units', label: 'Units', type: 'text', required: true, placeholder: 'e.g., pieces, kg, tons' },
          { key: 'Unit Price', label: 'Unit Price (USD)', type: 'number', required: true },
          { key: 'Total Value', label: 'Total Value (USD)', type: 'number', required: true },
          { key: 'Incoterms', label: 'Incoterms', type: 'select', required: true, options: ['FOB', 'CIF', 'CFR', 'EXW'] },
          { key: 'Indian Port', label: 'Indian Port', type: 'text', required: true },
          { key: 'African Port', label: 'African Port', type: 'text', required: true },
          { key: 'Shipment Date', label: 'Latest Shipment Date', type: 'date', required: true },
          { key: 'Payment Method', label: 'Payment Method', type: 'select', required: true, options: ['Letter of Credit', 'Telegraphic Transfer', 'Document Against Payment'] },
          { key: 'Advance Percentage', label: 'Advance Payment (%)', type: 'number', required: true },
          { key: 'Inspection Location', label: 'Inspection Location', type: 'text', required: true },
          { key: 'Exporter Signatory Title', label: 'Exporter Signatory Title', type: 'text', required: true },
          { key: 'Importer Signatory Title', label: 'Importer Signatory Title', type: 'text', required: true }
        ],
        isOfficial: true,
        downloads: 0,
        rating: 4.7,
        createdAt: new Date().toISOString()
      },

      // SERVICE AGREEMENTS
      {
        id: 'service-za-consulting',
        title: 'South Africa Consulting Services Agreement',
        type: 'service',
        description: 'Professional consulting services agreement for South African market',
        jurisdiction: 'ZA',
        content: `CONSULTING SERVICES AGREEMENT

This Consulting Services Agreement ("Agreement") is made on [Date] between:

[Client Name], with principal place of business at [Client Address] ("Client")

AND

[Consultant Name], with principal place of business at [Consultant Address] ("Consultant")

1. SERVICES: The Consultant shall provide the following services: [Services Description].

2. TERM: This Agreement shall commence on [Start Date] and continue until [End Date].

3. COMPENSATION:
   - Fee Structure: [Fee Structure]
   - Payment Terms: [Payment Terms]
   - Total Estimated Fee: [Total Fee] ZAR

4. CONFIDENTIALITY: Both parties agree to maintain the confidentiality of all proprietary information.

5. INDEPENDENT CONTRACTOR: Consultant is an independent contractor and not an employee of Client.

6. SOUTH AFRICAN LAW: This Agreement shall be governed by the laws of South Africa.

7. TERMINATION: Either party may terminate this Agreement with [Notice Period] days written notice.

SIGNATURES:

CLIENT: _________________________
Name: [Client Representative]
Title: [Client Title]

CONSULTANT: _________________________
Name: [Consultant Representative]
Title: [Consultant Title]

DATE: [Date]`,
        fields: [
          { key: 'Date', label: 'Agreement Date', type: 'date', required: true },
          { key: 'Client Name', label: 'Client Name', type: 'text', required: true },
          { key: 'Client Address', label: 'Client Address', type: 'text', required: true },
          { key: 'Consultant Name', label: 'Consultant Name', type: 'text', required: true },
          { key: 'Consultant Address', label: 'Consultant Address', type: 'text', required: true },
          { key: 'Services Description', label: 'Services Description', type: 'textarea', required: true },
          { key: 'Start Date', label: 'Start Date', type: 'date', required: true },
          { key: 'End Date', label: 'End Date', type: 'date', required: true },
          { key: 'Fee Structure', label: 'Fee Structure', type: 'textarea', required: true, placeholder: 'e.g., Hourly rate, fixed fee, monthly retainer' },
          { key: 'Payment Terms', label: 'Payment Terms', type: 'textarea', required: true },
          { key: 'Total Fee', label: 'Total Estimated Fee (ZAR)', type: 'number', required: true },
          { key: 'Notice Period', label: 'Termination Notice Period (days)', type: 'number', required: true },
          { key: 'Client Representative', label: 'Client Representative', type: 'text', required: true },
          { key: 'Client Title', label: 'Client Title', type: 'text', required: true },
          { key: 'Consultant Representative', label: 'Consultant Representative', type: 'text', required: true },
          { key: 'Consultant Title', label: 'Consultant Title', type: 'text', required: true }
        ],
        isOfficial: true,
        downloads: 0,
        rating: 4.5,
        createdAt: new Date().toISOString()
      },

      // PARTNERSHIP AGREEMENTS
      {
        id: 'partnership-gh-business',
        title: 'Ghana Business Partnership Agreement',
        type: 'partnership',
        description: 'General partnership agreement for Ghanaian businesses',
        jurisdiction: 'GH',
        content: `BUSINESS PARTNERSHIP AGREEMENT

This Partnership Agreement ("Agreement") is made on [Date] between:

[Partner 1 Name], with address at [Partner 1 Address] ("Partner 1")

AND

[Partner 2 Name], with address at [Partner 2 Address] ("Partner 2")

(Collectively referred to as "Partners")

1. PARTNERSHIP NAME: The partnership shall operate under the name: [Partnership Name].

2. BUSINESS PURPOSE: The partnership shall engage in: [Business Purpose].

3. CAPITAL CONTRIBUTIONS:
   - Partner 1 Contribution: [Partner 1 Contribution] GHS
   - Partner 2 Contribution: [Partner 2 Contribution] GHS

4. PROFIT AND LOSS SHARING:
   - Partner 1 Share: [Partner 1 Share]%
   - Partner 2 Share: [Partner 2 Share]%

5. MANAGEMENT: Major decisions shall require approval of both partners.

6. TERM: This partnership shall commence on [Start Date] and continue until terminated.

7. GHANAIAN LAW: This Agreement shall be governed by the laws of Ghana.

8. DISPUTE RESOLUTION: Any disputes shall be resolved through [Dispute Resolution Method].

SIGNATURES:

PARTNER 1: _________________________
Name: [Partner 1 Name]
Date: [Date]

PARTNER 2: _________________________
Name: [Partner 2 Name]
Date: [Date]

WITNESS: _________________________
Name: [Witness Name]
Date: [Date]`,
        fields: [
          { key: 'Date', label: 'Agreement Date', type: 'date', required: true },
          { key: 'Partner 1 Name', label: 'Partner 1 Full Name', type: 'text', required: true },
          { key: 'Partner 1 Address', label: 'Partner 1 Address', type: 'text', required: true },
          { key: 'Partner 2 Name', label: 'Partner 2 Full Name', type: 'text', required: true },
          { key: 'Partner 2 Address', label: 'Partner 2 Address', type: 'text', required: true },
          { key: 'Partnership Name', label: 'Partnership Name', type: 'text', required: true },
          { key: 'Business Purpose', label: 'Business Purpose', type: 'textarea', required: true },
          { key: 'Partner 1 Contribution', label: 'Partner 1 Contribution (GHS)', type: 'number', required: true },
          { key: 'Partner 2 Contribution', label: 'Partner 2 Contribution (GHS)', type: 'number', required: true },
          { key: 'Partner 1 Share', label: 'Partner 1 Profit Share (%)', type: 'number', required: true },
          { key: 'Partner 2 Share', label: 'Partner 2 Profit Share (%)', type: 'number', required: true },
          { key: 'Start Date', label: 'Partnership Start Date', type: 'date', required: true },
          { key: 'Dispute Resolution Method', label: 'Dispute Resolution Method', type: 'select', required: true, options: ['Mediation', 'Arbitration', 'Court Proceedings'] },
          { key: 'Witness Name', label: 'Witness Name', type: 'text', required: false }
        ],
        isOfficial: true,
        downloads: 0,
        rating: 4.4,
        createdAt: new Date().toISOString()
      }
    ]
  }

  // Get templates by type
  static getTemplatesByType(type: string): ContractTemplate[] {
    return this.getAllTemplates().filter(template => template.type === type)
  }

  // Get templates by jurisdiction
  static getTemplatesByJurisdiction(jurisdiction: string): ContractTemplate[] {
    return this.getAllTemplates().filter(template => template.jurisdiction === jurisdiction)
  }

  // Get template by ID
  static getTemplateById(id: string): ContractTemplate | undefined {
    return this.getAllTemplates().find(template => template.id === id)
  }

  // Search templates
  static searchTemplates(query: string): ContractTemplate[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllTemplates().filter(template =>
      template.title.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.type.toLowerCase().includes(lowerQuery)
    )
  }
}