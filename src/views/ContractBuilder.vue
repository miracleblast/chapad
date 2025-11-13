<template>
  <div class="min-h-screen bg-chapa-sand-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button @click="goBack" class="btn-ghost p-2">
              <Icon icon="material-symbols:arrow-back" class="text-xl" />
            </button>
            <div>
              <h1 class="text-lg font-cal text-chapa-purple-600 dark:text-chapa-purple-300">
                {{ currentContractType?.name || 'Create Contract' }}
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-poppins">
                Step {{ currentStep }} of {{ totalSteps }}
              </p>
            </div>
          </div>
          <button @click="saveDraft" class="btn-ghost p-2">
            <Icon icon="material-symbols:save" class="text-xl" />
          </button>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="bg-white dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>Step {{ currentStep }}</span>
        <span>{{ Math.round((currentStep / totalSteps) * 100) }}% Complete</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          class="bg-chapa-purple-500 h-2 rounded-full transition-all duration-500"
          :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Main Form Content -->
    <div class="container mx-auto px-4 py-6 pb-24"> <!-- Added padding for footer -->
      <!-- Step 1: Contract Basics -->
      <div v-if="currentStep === 1" class="space-y-6">
        <!-- Contract Title -->
        <div class="chapa-glass-card p-5">
          <label class="block text-sm font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
            Contract Title *
            <span v-if="!contractData.title?.trim()" class="text-red-500 text-xs ml-1">(Required)</span>
          </label>
          <input 
            v-model="contractData.title"
            type="text" 
            placeholder="e.g., Sales Agreement with ABC Company"
            class="input-modern w-full"
            :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && !contractData.title?.trim() }"
            @input="autoGenerateSlug"
          >
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Give your contract a clear, descriptive name
          </p>
        </div>

        <!-- Parties Information -->
        <div class="chapa-glass-card p-5">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
            Parties Involved
          </h3>
          
          <!-- First Party -->
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                Your Company/Name *
                <span v-if="showErrors && !contractData.parties.firstParty.name?.trim()" class="text-red-500 text-xs ml-1">(Required)</span>
              </label>
              <input 
                v-model="contractData.parties.firstParty.name"
                type="text" 
                placeholder="Company name or your full name"
                class="input-modern w-full"
                :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && !contractData.parties.firstParty.name?.trim() }"
              >
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                Second Party *
                <span v-if="showErrors && !contractData.parties.secondParty.name?.trim()" class="text-red-500 text-xs ml-1">(Required)</span>
              </label>
              <input 
                v-model="contractData.parties.secondParty.name"
                type="text" 
                placeholder="Other party's name or company"
                class="input-modern w-full"
                :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && !contractData.parties.secondParty.name?.trim() }"
              >
            </div>
          </div>
        </div>

        <!-- Jurisdiction -->
        <div class="chapa-glass-card p-5">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
            Jurisdiction & Currency
          </h3>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- Your Country -->
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                Your Country *
                <span v-if="showErrors && !contractData.jurisdiction.firstCountry" class="text-red-500 text-xs ml-1">(Required)</span>
              </label>
              <select 
                v-model="contractData.jurisdiction.firstCountry"
                class="input-modern w-full"
                :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && !contractData.jurisdiction.firstCountry }"
              >
                <option value="">Select country</option>
                <option 
                  v-for="country in targetCountries.africa" 
                  :key="'first-' + country.code"
                  :value="country.code"
                >
                  {{ country.name }}
                </option>
                <option disabled>───</option>
                <option 
                  v-for="country in targetCountries.asia" 
                  :key="'first-' + country.code"
                  :value="country.code"
                >
                  {{ country.name }}
                </option>
              </select>
            </div>

            <!-- Their Country -->
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                Their Country *
                <span v-if="showErrors && !contractData.jurisdiction.secondCountry" class="text-red-500 text-xs ml-1">(Required)</span>
              </label>
              <select 
                v-model="contractData.jurisdiction.secondCountry"
                class="input-modern w-full"
                :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && !contractData.jurisdiction.secondCountry }"
              >
                <option value="">Select country</option>
                <option 
                  v-for="country in targetCountries.africa" 
                  :key="'second-' + country.code"
                  :value="country.code"
                >
                  {{ country.name }}
                </option>
                <option disabled>───</option>
                <option 
                  v-for="country in targetCountries.asia" 
                  :key="'second-' + country.code"
                  :value="country.code"
                >
                  {{ country.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Currency -->
          <div class="mt-4">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
              Contract Currency *
              <span v-if="showErrors && !contractData.jurisdiction.currency" class="text-red-500 text-xs ml-1">(Required)</span>
            </label>
            <select 
              v-model="contractData.jurisdiction.currency"
              class="input-modern w-full"
              :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && !contractData.jurisdiction.currency }"
            >
              <option value="">Select currency</option>
              <option 
                v-for="currency in availableCurrencies" 
                :key="currency.code"
                :value="currency.code"
              >
                {{ currency.symbol }} {{ currency.name }} ({{ currency.code }})
              </option>
            </select>
          </div>
        </div>

        <!-- Validation Summary -->
        <div v-if="showErrors && !isStep1Valid" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <Icon icon="material-symbols:error" class="text-red-500 text-xl mt-0.5 flex-shrink-0" />
            <div>
              <h4 class="font-semibold text-red-800 dark:text-red-300 text-sm">Please complete all required fields</h4>
              <p class="text-red-700 dark:text-red-400 text-xs mt-1">Fill in the missing information above to continue</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Contract Details (Dynamic based on type) -->
      <div v-if="currentStep === 2" class="space-y-6">
        <!-- Contract Type Specific Content -->
        <div v-if="currentContractType?.id === 'debt'" class="space-y-6">
          <!-- Debt Amount -->
          <div class="chapa-glass-card p-5">
            <label class="block text-sm font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
              Loan Amount *
            </label>
            <div class="flex space-x-3">
              <select 
                v-model="contractData.debt.currency"
                class="input-modern w-24 flex-shrink-0"
              >
                <option 
                  v-for="currency in availableCurrencies" 
                  :key="'debt-' + currency.code"
                  :value="currency.code"
                >
                  {{ currency.symbol }}
                </option>
              </select>
              <input 
                v-model="contractData.debt.amount"
                type="number" 
                placeholder="0.00"
                class="input-modern flex-1"
              >
            </div>
          </div>

          <!-- Interest Rate -->
          <div class="chapa-glass-card p-5">
            <label class="block text-sm font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
              Interest Rate (% per annum)
            </label>
            <input 
              v-model="contractData.debt.interestRate"
              type="number" 
              placeholder="e.g., 10"
              step="0.1"
              class="input-modern w-full"
            >
          </div>

          <!-- Repayment Terms -->
          <div class="chapa-glass-card p-5">
            <label class="block text-sm font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
              Repayment Period (Months)
            </label>
            <input 
              v-model="contractData.debt.repaymentMonths"
              type="number" 
              placeholder="e.g., 12"
              class="input-modern w-full"
            >
          </div>
        </div>

        <!-- Sales Agreement Content -->
        <div v-else-if="currentContractType?.id === 'sales'" class="space-y-6">
          <!-- Goods Description -->
          <div class="chapa-glass-card p-5">
            <label class="block text-sm font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
              Goods/Services Description *
            </label>
            <textarea 
              v-model="contractData.sales.description"
              rows="3"
              placeholder="Describe the goods or services being sold..."
              class="input-modern w-full resize-none"
            ></textarea>
          </div>

          <!-- Price -->
          <div class="chapa-glass-card p-5">
            <label class="block text-sm font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
              Total Price *
            </label>
            <div class="flex space-x-3">
              <select 
                v-model="contractData.sales.currency"
                class="input-modern w-24 flex-shrink-0"
              >
                <option 
                  v-for="currency in availableCurrencies" 
                  :key="'sales-' + currency.code"
                  :value="currency.code"
                >
                  {{ currency.symbol }}
                </option>
              </select>
              <input 
                v-model="contractData.sales.price"
                type="number" 
                placeholder="0.00"
                class="input-modern flex-1"
              >
            </div>
          </div>

          <!-- Delivery Terms -->
          <div class="chapa-glass-card p-5">
            <label class="block text-sm font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
              Delivery Date
            </label>
            <input 
              v-model="contractData.sales.deliveryDate"
              type="date" 
              class="input-modern w-full"
            >
          </div>
        </div>

        <!-- Default Content for other types -->
        <div v-else class="chapa-glass-card p-5 text-center">
          <Icon icon="material-symbols:construction" class="text-4xl text-chapa-orange-500 mb-3" />
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 font-poppins">
            Contract Details
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Configure the specific details for your {{ currentContractType?.name }}
          </p>
          <button @click="autoFillTemplate" class="btn-secondary">
            <Icon icon="material-symbols:auto-awesome" class="text-lg" />
            <span>Auto-fill Template</span>
          </button>
        </div>
      </div>

      <!-- Step 3: Terms & Conditions -->
      <div v-if="currentStep === 3" class="space-y-6">
        <div class="chapa-glass-card p-5">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
            Terms & Conditions *
            <span v-if="showErrors && !contractData.terms?.trim()" class="text-red-500 text-xs ml-1">(Required)</span>
          </h3>
          <textarea 
            v-model="contractData.terms"
            rows="8"
            placeholder="Enter the specific terms and conditions of this agreement..."
            class="input-modern w-full resize-none"
            :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && !contractData.terms?.trim() }"
          ></textarea>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Describe the rights, responsibilities, and obligations of both parties
          </p>
        </div>

        <!-- Auto-generated clauses based on contract type -->
        <div class="chapa-glass-card p-5">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
            Suggested Clauses
          </h3>
          <div class="space-y-2">
            <button 
              v-for="clause in suggestedClauses"
              :key="clause.id"
              @click="addClause(clause.text)"
              class="w-full text-left p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600/50 transition-colors border border-gray-200 dark:border-gray-600"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300 font-poppins">
                  {{ clause.title }}
                </span>
                <Icon icon="material-symbols:add" class="text-chapa-purple-500" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Footer -->
    <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div class="container mx-auto">
        <div class="flex space-x-3">
          <button 
            v-if="currentStep > 1"
            @click="previousStep"
            class="btn-secondary flex-1 flex items-center justify-center space-x-2 py-3"
          >
            <Icon icon="material-symbols:arrow-back" class="text-lg" />
            <span class="font-poppins font-medium">Back</span>
          </button>
          
          <button 
            @click="nextStep"
            :disabled="currentStep === totalSteps && !contractData.terms?.trim()"
            class="flex-1 flex items-center justify-center space-x-2 py-3 font-poppins font-medium transition-all duration-300"
            :class="getNextButtonClass()"
          >
            <span>{{ getNextButtonText() }}</span>
            <Icon 
              :icon="currentStep === totalSteps ? 'material-symbols:check' : 'material-symbols:arrow-forward'" 
              class="text-lg" 
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Step management
const currentStep = ref(1)
const totalSteps = 3
const showErrors = ref(false)

// Contract data
const contractData = ref({
  title: '',
  slug: '',
  type: '',
  parties: {
    firstParty: { name: '', address: '', contact: '' },
    secondParty: { name: '', address: '', contact: '' }
  },
  jurisdiction: {
    firstCountry: '',
    secondCountry: '',
    currency: ''
  },
  terms: '',
  clauses: [] as string[],
  // Dynamic fields based on contract type
  debt: {
    amount: '',
    currency: 'NGN',
    interestRate: '',
    repaymentMonths: ''
  },
  sales: {
    description: '',
    price: '',
    currency: 'NGN',
    deliveryDate: ''
  }
})

// Available countries and currencies (same as before)
const targetCountries = {
  africa: [
    { code: 'NG', name: 'Nigeria', currency: 'NGN' },
    { code: 'KE', name: 'Kenya', currency: 'KES' },
    { code: 'GH', name: 'Ghana', currency: 'GHS' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
    { code: 'EG', name: 'Egypt', currency: 'EGP' },
    { code: 'TD', name: 'Chad', currency: 'XAF' }
  ],
  asia: [
    { code: 'CN', name: 'China', currency: 'CNY' },
    { code: 'IN', name: 'India', currency: 'INR' },
    { code: 'RU', name: 'Russia', currency: 'RUB' }
  ]
}

const availableCurrencies = [
  { code: 'NGN', name: 'Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'GHS', name: 'Ghana Cedi', symbol: 'GH₵' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'XAF', name: 'CFA Franc', symbol: 'FCFA' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' }
]

// Contract types
const contractTypes = {
  debt: { id: 'debt', name: 'Debt Agreement', icon: 'material-symbols:money' },
  sales: { id: 'sales', name: 'Sales Agreement', icon: 'material-symbols:shopping-cart' },
  service: { id: 'service', name: 'Service Contract', icon: 'material-symbols:design-services' },
  partnership: { id: 'partnership', name: 'Partnership Agreement', icon: 'material-symbols:handshake' }
}

const currentContractType = computed(() => {
  const type = route.query.type as string
  return contractTypes[type as keyof typeof contractTypes] || null
})

// Validation
const isStep1Valid = computed(() => {
  return (
    contractData.value.title?.trim() &&
    contractData.value.parties.firstParty.name?.trim() &&
    contractData.value.parties.secondParty.name?.trim() &&
    contractData.value.jurisdiction.firstCountry &&
    contractData.value.jurisdiction.secondCountry &&
    contractData.value.jurisdiction.currency
  )
})

const isStep3Valid = computed(() => {
  return contractData.value.terms?.trim()
})

// Suggested clauses (same as before)
const suggestedClauses = computed(() => {
  const type = route.query.type as string
  const clauses = {
    debt: [
      { id: 1, title: 'Repayment Schedule', text: 'The borrower agrees to repay the loan in monthly installments...' },
      { id: 2, title: 'Interest Rate', text: 'An annual interest rate of X% will be applied to the outstanding balance...' },
      { id: 3, title: 'Default Consequences', text: 'In case of default, the lender has the right to...' }
    ],
    sales: [
      { id: 1, title: 'Delivery Terms', text: 'The seller shall deliver the goods to the specified location...' },
      { id: 2, title: 'Payment Terms', text: 'Payment shall be made within 30 days of invoice date...' },
      { id: 3, title: 'Warranty', text: 'The seller warrants that the goods are free from defects...' }
    ]
  }
  return clauses[type as keyof typeof clauses] || []
})

// Methods
const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    showErrors.value = false
  } else {
    router.push('/')
  }
}

const nextStep = () => {
  // Validate current step before proceeding
  if (currentStep.value === 1 && !isStep1Valid.value) {
    showErrors.value = true
    // Scroll to top to show errors
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  if (currentStep.value === 3 && !isStep3Valid.value) {
    showErrors.value = true
    return
  }

  if (currentStep.value < totalSteps) {
    currentStep.value++
    showErrors.value = false
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    createContract()
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    showErrors.value = false
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getNextButtonClass = () => {
  if (currentStep.value === totalSteps && !contractData.value.terms?.trim()) {
    return 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }
  return 'btn-primary hover:scale-105 active:scale-95'
}

const getNextButtonText = () => {
  switch (currentStep.value) {
    case 1: return 'Continue to Details'
    case 2: return 'Continue to Terms'
    case 3: return 'Create Contract'
    default: return 'Continue'
  }
}

const autoGenerateSlug = () => {
  if (contractData.value.title) {
    contractData.value.slug = contractData.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }
}

const addClause = (clauseText: string) => {
  contractData.value.terms += '\n\n' + clauseText
}

const autoFillTemplate = () => {
  const templates = {
    debt: `DEBT AGREEMENT

This Debt Agreement is made between [First Party] and [Second Party].

1. LOAN AMOUNT: [Amount] [Currency]
2. INTEREST RATE: [Rate]% per annum
3. REPAYMENT: [Months] months
4. DEFAULT: Consequences as per applicable laws.`,
    
    sales: `SALES AGREEMENT

This Sales Agreement is made between [First Party] and [Second Party].

1. GOODS: [Description]
2. PRICE: [Amount] [Currency]  
3. DELIVERY: As agreed by both parties
4. PAYMENT: Terms to be specified.`
  }

  const template = templates[contractData.value.type as keyof typeof templates]
  if (template) {
    contractData.value.terms = template
  }
}

const saveDraft = () => {
  localStorage.setItem('contractDraft', JSON.stringify(contractData.value))
  alert('Draft saved successfully!')
}

const createContract = () => {
  console.log('Creating contract:', contractData.value)
  // Navigate to preview/signature page
  router.push('/signature')
}

onMounted(() => {
  if (route.query.type) {
    contractData.value.type = route.query.type as string
  }
  
  const draft = localStorage.getItem('contractDraft')
  if (draft) {
    contractData.value = { ...contractData.value, ...JSON.parse(draft) }
  }
})
</script>

<style scoped>
.container {
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

input, select, textarea {
  font-size: 16px;
}

.step-transition {
  transition: all 0.3s ease-in-out;
}
</style>