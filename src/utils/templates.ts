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
      },
      {
  id: 'mining-license-ghana',
  title: 'Ghana Mining License Agreement',
  type: 'mining',
  description: 'Mining license agreement compliant with Ghana Minerals and Mining Act, 2006',
  jurisdiction: 'GH',
  content: `MINING LICENSE AGREEMENT - GHANA

This Mining License Agreement ("Agreement") is made on [Date] between:

THE GOVERNMENT OF THE REPUBLIC OF GHANA, acting through the Minerals Commission of Ghana ("Licensor")

AND

[Company Name], a company incorporated under the Companies Act, 2019 (Act 992) with registration number [Company Registration Number] and having its registered office at [Company Address] ("Licensee")

RECITALS:
A. The Licensor is responsible for administering Ghana's mineral resources under the Minerals and Mining Act, 2006 (Act 703)
B. The Licensee has the technical and financial capability to undertake mining operations

ARTICLE 1 - GRANT OF LICENSE
1.1 The Licensor grants the Licensee an exclusive mining license for [Mineral Type] in the area described as [Mining Area Coordinates] ("Licensed Area")
1.2 License Term: [License Years] years, renewable subject to compliance
1.3 Total Area: [Area Size] square kilometers

ARTICLE 2 - OBLIGATIONS OF LICENSEE
2.1 Pay annual mineral rights fees as prescribed by the Minerals Commission
2.2 Submit quarterly production reports to the Minerals Commission
2.3 Maintain environmental bond of [Bond Amount] GHS
2.4 Employ at least [Local Employment Percentage]% Ghanaian personnel
2.5 Implement approved Environmental Management Plan

ARTICLE 3 - ROYALTIES AND TAXES
3.1 Royalty Rate: [Royalty Percentage]% of total revenue as per Act 703
3.2 Corporate Income Tax: As per Ghana Revenue Authority regulations
3.3 Pay Mineral Duty as required by law

ARTICLE 4 - LOCAL CONTENT
4.1 Comply with Local Content and Local Participation Regulations, 2020 (L.I. 2431)
4.2 Prioritize Ghanaian goods and services where available
4.3 Transfer technology and build local capacity

ARTICLE 5 - DISPUTE RESOLUTION
5.1 Governing Law: Laws of Ghana
5.2 Dispute Resolution: Arbitration under Ghana Alternative Dispute Resolution Act, 2010 (Act 798)

IN WITNESS WHEREOF, the parties have executed this Agreement.

FOR THE GOVERNMENT OF GHANA:
_________________________
[Minister Name]
Minister for Lands and Natural Resources

FOR THE LICENSEE:
_________________________
[Company Representative]
[Title]
[Company Name]

DATE: [Date]`,
  fields: [
    { key: 'Date', label: 'Agreement Date', type: 'date', required: true },
    { key: 'Company Name', label: 'Mining Company Name', type: 'text', required: true },
    { key: 'Company Registration Number', label: 'Company Registration Number', type: 'text', required: true },
    { key: 'Company Address', label: 'Company Registered Address', type: 'text', required: true },
    { key: 'Mineral Type', label: 'Mineral Type', type: 'select', required: true, options: ['Gold', 'Diamond', 'Bauxite', 'Manganese', 'Limestone', 'Salt', 'Other'] },
    { key: 'Mining Area Coordinates', label: 'Mining Area Coordinates', type: 'textarea', required: true, placeholder: 'GPS coordinates of mining area' },
    { key: 'License Years', label: 'License Term (Years)', type: 'number', required: true },
    { key: 'Area Size', label: 'Area Size (sq km)', type: 'number', required: true },
    { key: 'Bond Amount', label: 'Environmental Bond Amount (GHS)', type: 'number', required: true },
    { key: 'Local Employment Percentage', label: 'Local Employment Percentage (%)', type: 'number', required: true },
    { key: 'Royalty Percentage', label: 'Royalty Rate (%)', type: 'number', required: true },
    { key: 'Minister Name', label: "Minister's Name", type: 'text', required: true },
    { key: 'Company Representative', label: 'Company Representative Name', type: 'text', required: true },
    { key: 'Title', label: 'Representative Title', type: 'text', required: true }
  ],
  isOfficial: true,
  downloads: 0,
  rating: 4.9,
  createdAt: new Date().toISOString()
},
{
  id: 'commodity-trading-africa',
  title: 'Africa Commodity Trading Agreement',
  type: 'commodity',
  description: 'Commodity trading agreement for African agricultural and mineral commodities',
  jurisdiction: 'AF', // Africa regional
  content: `AFRICA COMMODITY TRADING AGREEMENT

This Commodity Trading Agreement ("Agreement") is made on [Date] between:

[Seller Name], a company registered in [Seller Country] with address at [Seller Address] ("Seller")

AND

[Buyer Name], a company registered in [Buyer Country] with address at [Buyer Address] ("Buyer")

ARTICLE 1 - COMMODITY SPECIFICATIONS
1.1 Commodity: [Commodity Type]
1.2 Quality Standards: [Quality Standards]
1.3 Quantity: [Quantity] [Units]
1.4 Origin: [Country of Origin]

ARTICLE 2 - PRICE AND PAYMENT
2.1 Unit Price: [Unit Price] [Currency]
2.2 Total Value: [Total Value] [Currency]
2.3 Price Basis: [Price Basis - e.g., FOB, CIF]
2.4 Payment Terms: [Payment Terms]
2.5 Payment Currency: [Payment Currency]

ARTICLE 3 - DELIVERY AND SHIPPING
3.1 Delivery Period: [Delivery Period]
3.2 Port of Loading: [Loading Port]
3.3 Port of Discharge: [Discharge Port]
3.4 Shipping Documents: Bill of Lading, Certificate of Origin, Quality Certificate

ARTICLE 4 - AFRICAN TRADE PROVISIONS
4.1 Compliance with [Seller Country] export regulations
4.2 Compliance with [Buyer Country] import regulations
4.3 Certificate of Origin required for African continental trade
4.4 Adherence to AfCFTA rules where applicable

ARTICLE 5 - FORCE MAJEURE
5.1 Neither party liable for delays due to: political unrest, export bans, port closures, or other African market conditions

ARTICLE 6 - GOVERNING LAW
6.1 This Agreement shall be governed by [Governing Law Country] law
6.2 Disputes shall be referred to [Dispute Resolution Body]

IN WITNESS WHEREOF, the parties have executed this Agreement.

SELLER: _________________________
For [Seller Name]
Title: [Seller Signatory Title]

BUYER: _________________________
For [Buyer Name]
Title: [Buyer Signatory Title]

DATE: [Date]`,
  fields: [
    { key: 'Date', label: 'Agreement Date', type: 'date', required: true },
    { key: 'Seller Name', label: 'Seller Company Name', type: 'text', required: true },
    { key: 'Seller Country', label: 'Seller Country', type: 'text', required: true },
    { key: 'Seller Address', label: 'Seller Address', type: 'text', required: true },
    { key: 'Buyer Name', label: 'Buyer Company Name', type: 'text', required: true },
    { key: 'Buyer Country', label: 'Buyer Country', type: 'text', required: true },
    { key: 'Buyer Address', label: 'Buyer Address', type: 'text', required: true },
    { key: 'Commodity Type', label: 'Commodity Type', type: 'select', required: true, options: ['Cocoa', 'Coffee', 'Cotton', 'Palm Oil', 'Cashew', 'Gold', 'Copper', 'Crude Oil', 'Diamond', 'Other'] },
    { key: 'Quality Standards', label: 'Quality Standards', type: 'textarea', required: true },
    { key: 'Quantity', label: 'Quantity', type: 'number', required: true },
    { key: 'Units', label: 'Units', type: 'select', required: true, options: ['Metric Tons', 'Barrels', 'Kilograms', 'Bags', 'Ounces'] },
    { key: 'Country of Origin', label: 'Country of Origin', type: 'text', required: true },
    { key: 'Unit Price', label: 'Unit Price', type: 'number', required: true },
    { key: 'Currency', label: 'Currency', type: 'select', required: true, options: ['USD', 'EUR', 'XOF', 'XAF', 'ZAR', 'NGN'] },
    { key: 'Total Value', label: 'Total Value', type: 'number', required: true },
    { key: 'Price Basis', label: 'Price Basis', type: 'select', required: true, options: ['FOB', 'CIF', 'CFR', 'EXW'] },
    { key: 'Payment Terms', label: 'Payment Terms', type: 'select', required: true, options: ['Letter of Credit', 'Advance Payment', 'Document Against Acceptance', 'Open Account'] },
    { key: 'Payment Currency', label: 'Payment Currency', type: 'select', required: true, options: ['USD', 'EUR', 'XOF', 'XAF', 'ZAR'] },
    { key: 'Delivery Period', label: 'Delivery Period', type: 'text', required: true, placeholder: 'e.g., 30 days from agreement' },
    { key: 'Loading Port', label: 'Port of Loading', type: 'text', required: true },
    { key: 'Discharge Port', label: 'Port of Discharge', type: 'text', required: true },
    { key: 'Governing Law Country', label: 'Governing Law Country', type: 'text', required: true },
    { key: 'Dispute Resolution Body', label: 'Dispute Resolution Body', type: 'select', required: true, options: ['ICC International Court of Arbitration', 'LCIA', 'African Arbitration Association', 'National Courts'] },
    { key: 'Seller Signatory Title', label: 'Seller Signatory Title', type: 'text', required: true },
    { key: 'Buyer Signatory Title', label: 'Buyer Signatory Title', type: 'text', required: true }
  ],
  isOfficial: true,
  downloads: 0,
  rating: 4.7,
  createdAt: new Date().toISOString()
},
{
  id: 'agricultural-supply-rwanda',
  title: 'Rwanda Agricultural Product Supply Agreement',
  type: 'agriculture',
  description: 'Agricultural supply agreement compliant with Rwanda National Agricultural Export Development Board requirements',
  jurisdiction: 'RW',
  content: `RWANDA AGRICULTURAL PRODUCT SUPPLY AGREEMENT

This Agricultural Product Supply Agreement ("Agreement") is made on [Date] between:

[Supplier Name], a registered agricultural cooperative/company in Rwanda with registration number [Supplier Registration Number] and address at [Supplier Address] ("Supplier")

AND

[Buyer Name], a company registered in [Buyer Country] with address at [Buyer Address] ("Buyer")

RECITALS:
A. Supplier produces quality agricultural products in Rwanda
B. Buyer wishes to purchase agricultural products from Supplier
C. Both parties agree to comply with Rwanda Food and Drugs Authority regulations

ARTICLE 1 - PRODUCT SPECIFICATIONS
1.1 Product: [Agricultural Product]
1.2 Variety: [Product Variety]
1.3 Quality Grade: [Quality Grade] as per Rwanda Standards Board
1.4 Organic Certification: [Organic Status]
1.5 Packaging: [Packaging Requirements]

ARTICLE 2 - QUANTITY AND PRICE
2.1 Total Quantity: [Total Quantity] [Units]
2.2 Delivery Schedule: [Delivery Schedule]
2.3 Price: [Price per Unit] RWF per [Unit]
2.4 Price Adjustment: Prices may be adjusted based on [Price Adjustment Basis]

ARTICLE 3 - QUALITY CONTROL
3.1 All products must meet Rwanda Standards Board quality standards
3.2 Inspection at [Inspection Point] by [Inspecting Authority]
3.3 Certificate of Analysis required for each shipment
3.4 Compliance with maximum residue limits for pesticides

ARTICLE 4 - SUSTAINABILITY REQUIREMENTS
4.1 Supplier confirms sustainable farming practices
4.2 Fair labor practices in accordance with Rwanda labor laws
4.3 Environmental protection measures in place

ARTICLE 5 - GOVERNING LAW
5.1 This Agreement shall be governed by the laws of Rwanda
5.2 Disputes shall be referred to the Commercial Court of Rwanda

ARTICLE 6 - FORCE MAJEURE
6.1 Includes: adverse weather conditions, crop diseases, export restrictions

IN WITNESS WHEREOF, the parties have executed this Agreement.

SUPPLIER: _________________________
For [Supplier Name]
Title: [Supplier Signatory Title]

BUYER: _________________________
For [Buyer Name]
Title: [Buyer Signatory Title]

WITNESS: _________________________
Name: [Witness Name]
DATE: [Date]`,
  fields: [
    { key: 'Date', label: 'Agreement Date', type: 'date', required: true },
    { key: 'Supplier Name', label: 'Supplier Name/Cooperative', type: 'text', required: true },
    { key: 'Supplier Registration Number', label: 'Supplier Registration Number', type: 'text', required: true },
    { key: 'Supplier Address', label: 'Supplier Address', type: 'text', required: true },
    { key: 'Buyer Name', label: 'Buyer Company Name', type: 'text', required: true },
    { key: 'Buyer Country', label: 'Buyer Country', type: 'text', required: true },
    { key: 'Buyer Address', label: 'Buyer Address', type: 'text', required: true },
    { key: 'Agricultural Product', label: 'Agricultural Product', type: 'select', required: true, options: ['Coffee', 'Tea', 'Pyrethrum', 'Horticulture', 'Beans', 'Maize', 'Fruits', 'Vegetables'] },
    { key: 'Product Variety', label: 'Product Variety', type: 'text', required: true },
    { key: 'Quality Grade', label: 'Quality Grade', type: 'select', required: true, options: ['Grade A', 'Grade B', 'Grade C', 'Export Quality', 'Local Market'] },
    { key: 'Organic Status', label: 'Organic Certification', type: 'select', required: true, options: ['Certified Organic', 'In Conversion', 'Conventional', 'Not Specified'] },
    { key: 'Packaging Requirements', label: 'Packaging Requirements', type: 'textarea', required: true },
    { key: 'Total Quantity', label: 'Total Quantity', type: 'number', required: true },
    { key: 'Units', label: 'Units', type: 'select', required: true, options: ['Kilograms', 'Metric Tons', 'Bags', 'Crates', 'Boxes'] },
    { key: 'Delivery Schedule', label: 'Delivery Schedule', type: 'textarea', required: true },
    { key: 'Price per Unit', label: 'Price per Unit (RWF)', type: 'number', required: true },
    { key: 'Unit', label: 'Price Unit', type: 'text', required: true, placeholder: 'e.g., per kg, per ton' },
    { key: 'Price Adjustment Basis', label: 'Price Adjustment Basis', type: 'textarea', required: false },
    { key: 'Inspection Point', label: 'Quality Inspection Point', type: 'text', required: true },
    { key: 'Inspecting Authority', label: 'Inspecting Authority', type: 'text', required: true },
    { key: 'Supplier Signatory Title', label: 'Supplier Signatory Title', type: 'text', required: true },
    { key: 'Buyer Signatory Title', label: 'Buyer Signatory Title', type: 'text', required: true },
    { key: 'Witness Name', label: 'Witness Name', type: 'text', required: false }
  ],
  isOfficial: true,
  downloads: 0,
  rating: 4.6,
  createdAt: new Date().toISOString()
},
{
  id: 'china-africa-import-russia',
  title: 'China-Russia-Africa Tripartite Trade Agreement',
  type: 'import-export',
  description: 'Tripartite trade agreement for goods transiting between China, Russia, and African markets',
  jurisdiction: 'CN', // China as primary jurisdiction
  content: `CHINA-RUSSIA-AFRICA TRIPARTITE TRADE AGREEMENT

This Tripartite Trade Agreement ("Agreement") is made on [Date] between:

[Chinese Company Name], a company registered in China with address at [Chinese Company Address] ("Chinese Party")

AND

[Russian Company Name], a company registered in Russia with address at [Russian Company Address] ("Russian Party") 

AND

[African Company Name], a company registered in [African Country] with address at [African Company Address] ("African Party")

RECITALS:
A. Chinese Party manufactures [Product Description]
B. Russian Party provides logistics and transit services
C. African Party distributes products in African markets
D. Parties wish to establish tripartite trade relationship

ARTICLE 1 - ROLES AND RESPONSIBILITIES
1.1 Chinese Party: Manufacture and quality control of products
1.2 Russian Party: Logistics, customs clearance, and transit through Russia
1.3 African Party: Market distribution, after-sales service, and compliance with African regulations

ARTICLE 2 - PRODUCT SPECIFICATIONS
2.1 Product: [Product Description]
2.2 Technical Standards: Compliant with [Chinese Standards], [Russian Standards], and [African Standards]
2.3 Quantity: [Annual Quantity] units per year
2.4 Packaging: Trilingual packaging (Chinese, Russian, English/French)

ARTICLE 3 - PAYMENT TERMS
3.1 Currency: [Primary Currency] for inter-party settlements
3.2 Payment Method: [Payment Method]
3.3 Payment Schedule: [Payment Schedule]

ARTICLE 4 - LOGISTICS AND TRANSIT
4.1 Shipping Route: China → Russia → [African Destination]
4.2 Russian Transit Time: Maximum [Transit Days] days
4.3 Customs Clearance: Each party responsible for own country customs
4.4 Insurance: [Insurance Coverage] throughout transit

ARTICLE 5 - COMPLIANCE
5.1 Chinese Party: Comply with China export control regulations
5.2 Russian Party: Comply with Russian transit and customs laws
5.3 African Party: Comply with [African Country] import regulations and product standards

ARTICLE 6 - GOVERNING LAW AND DISPUTES
6.1 Primary Governing Law: [Primary Governing Law]
6.2 Dispute Resolution: [Dispute Resolution Method]
6.3 Language: English (with Chinese and Russian translations)

IN WITNESS WHEREOF, the parties have executed this Agreement.

CHINESE PARTY: _________________________
For [Chinese Company Name]
Title: [Chinese Signatory Title]

RUSSIAN PARTY: _________________________
For [Russian Company Name]
Title: [Russian Signatory Title]

AFRICAN PARTY: _________________________
For [African Company Name]
Title: [African Signatory Title]

DATE: [Date]`,
  fields: [
    { key: 'Date', label: 'Agreement Date', type: 'date', required: true },
    { key: 'Chinese Company Name', label: 'Chinese Company Name', type: 'text', required: true },
    { key: 'Chinese Company Address', label: 'Chinese Company Address', type: 'text', required: true },
    { key: 'Russian Company Name', label: 'Russian Company Name', type: 'text', required: true },
    { key: 'Russian Company Address', label: 'Russian Company Address', type: 'text', required: true },
    { key: 'African Company Name', label: 'African Company Name', type: 'text', required: true },
    { key: 'African Country', label: 'African Country', type: 'text', required: true },
    { key: 'African Company Address', label: 'African Company Address', type: 'text', required: true },
    { key: 'Product Description', label: 'Product Description', type: 'textarea', required: true },
    { key: 'Chinese Standards', label: 'Chinese Technical Standards', type: 'text', required: true },
    { key: 'Russian Standards', label: 'Russian Technical Standards', type: 'text', required: true },
    { key: 'African Standards', label: 'African Technical Standards', type: 'text', required: true },
    { key: 'Annual Quantity', label: 'Annual Quantity (units)', type: 'number', required: true },
    { key: 'Primary Currency', label: 'Settlement Currency', type: 'select', required: true, options: ['USD', 'EUR', 'CNY', 'RUB'] },
    { key: 'Payment Method', label: 'Payment Method', type: 'select', required: true, options: ['Letter of Credit', 'Bank Transfer', 'Escrow', 'Advance Payment'] },
    { key: 'Payment Schedule', label: 'Payment Schedule', type: 'textarea', required: true },
    { key: 'African Destination', label: 'Final African Destination', type: 'text', required: true },
    { key: 'Transit Days', label: 'Maximum Russian Transit Days', type: 'number', required: true },
    { key: 'Insurance Coverage', label: 'Insurance Coverage', type: 'textarea', required: true },
    { key: 'Primary Governing Law', label: 'Primary Governing Law', type: 'select', required: true, options: ['Chinese Law', 'Russian Law', 'English Law', 'Swiss Law'] },
    { key: 'Dispute Resolution Method', label: 'Dispute Resolution', type: 'select', required: true, options: ['ICC Arbitration', 'CIETAC', 'Russian Arbitration', 'Mediation'] },
    { key: 'Chinese Signatory Title', label: 'Chinese Signatory Title', type: 'text', required: true },
    { key: 'Russian Signatory Title', label: 'Russian Signatory Title', type: 'text', required: true },
    { key: 'African Signatory Title', label: 'African Signatory Title', type: 'text', required: true }
  ],
  isOfficial: true,
  downloads: 0,
  rating: 4.8,
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