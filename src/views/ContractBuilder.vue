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
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          class="bg-chapa-purple-500 h-2 rounded-full transition-all duration-500"
          :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Main Form Content -->
    <div class="container mx-auto px-4 py-6">
      <!-- Step 1: Contract Basics -->
      <div v-if="currentStep === 1" class="space-y-6">
        <!-- Contract Title -->
        <div class="chapa-glass-card p-5">
          <label class="block text-sm font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
            Contract Title *
          </label>
          <input 
            v-model="contractData.title"
            type="text" 
            placeholder="e.g., Sales Agreement with ABC Company"
            class="input-modern w-full"
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
              </label>
              <input 
                v-model="contractData.parties.firstParty.name"
                type="text" 
                placeholder="Company name or your full name"
                class="input-modern w-full"
              >
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                Second Party *
              </label>
              <input 
                v-model="contractData.parties.secondParty.name"
                type="text" 
                placeholder="Other party's name or company"
                class="input-modern w-full"
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
              </label>
              <select 
                v-model="contractData.jurisdiction.firstCountry"
                class="input-modern w-full"
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
              </label>
              <select 
                v-model="contractData.jurisdiction.secondCountry"
                class="input-modern w-full"
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
            </label>
            <select 
              v-model="contractData.jurisdiction.currency"
              class="input-modern w-full"
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
      </div>

      <!-- Step 2: Contract Details (Dynamic based on type) -->
      <div v-if="currentStep === 2" class="space-y-6">
        <!-- Dynamic fields will go here based on contract type -->
        <div class="chapa-glass-card p-5 text-center">
          <Icon icon="material-symbols:construction" class="text-4xl text-chapa-orange-500 mb-3" />
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 font-poppins">
            Contract Details
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Dynamic fields for {{ currentContractType?.name }} coming soon!
          </p>
        </div>
      </div>

      <!-- Step 3: Terms & Conditions -->
      <div v-if="currentStep === 3" class="space-y-6">
        <div class="chapa-glass-card p-5">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
            Terms & Conditions
          </h3>
          <textarea 
            v-model="contractData.terms"
            rows="6"
            placeholder="Enter the specific terms and conditions of this agreement..."
            class="input-modern w-full resize-none"
          ></textarea>
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
            <Icon icon="material-symbols:arrow-back" />
            <span class="font-poppins">Back</span>
          </button>
          
          <button 
            @click="nextStep"
            class="btn-primary flex-1 flex items-center justify-center space-x-2 py-3"
          >
            <span class="font-poppins">
              {{ currentStep === totalSteps ? 'Create Contract' : 'Continue' }}
            </span>
            <Icon icon="material-symbols:arrow-forward" />
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
  clauses: [] as string[]
})

// Available countries and currencies
const targetCountries = {
  africa: [
    { code: 'NG', name: 'Nigeria', currency: 'NGN' },
    { code: 'KE', name: 'Kenya', currency: 'KES' },
    { code: 'GH', name: 'Ghana', currency: 'GHS' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
    { code: 'EG', name: 'Egypt', currency: 'EGP' },
    { code: 'TD', name: 'Chad', currency: 'XAF' }
    // ... all 54 countries
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
  debt: { name: 'Debt Agreement', icon: 'material-symbols:money' },
  sales: { name: 'Sales Agreement', icon: 'material-symbols:shopping-cart' },
  service: { name: 'Service Contract', icon: 'material-symbols:design-services' },
  partnership: { name: 'Partnership Agreement', icon: 'material-symbols:handshake' }
}

const currentContractType = computed(() => {
  const type = route.query.type as string
  return contractTypes[type as keyof typeof contractTypes] || null
})

// Suggested clauses based on contract type
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
    // Add more for other contract types
  }
  return clauses[type as keyof typeof clauses] || []
})

// Methods
const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.push('/')
  }
}

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  } else {
    createContract()
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
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

const saveDraft = () => {
  // Save to local storage
  localStorage.setItem('contractDraft', JSON.stringify(contractData.value))
  // Show success message
  alert('Draft saved successfully!')
}

const createContract = () => {
  // Final contract creation logic
  console.log('Creating contract:', contractData.value)
  // Navigate to preview/signature page
  router.push('/signature')
}

onMounted(() => {
  // Load contract type from URL
  if (route.query.type) {
    contractData.value.type = route.query.type as string
  }
  
  // Load draft if exists
  const draft = localStorage.getItem('contractDraft')
  if (draft) {
    contractData.value = { ...contractData.value, ...JSON.parse(draft) }
  }
})
</script>

<style scoped>
/* Mobile-optimized styles */
.container {
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Ensure inputs are mobile-friendly */
input, select, textarea {
  font-size: 16px; /* Prevents zoom on iOS */
}

/* Smooth transitions for step changes */
.step-transition {
  transition: all 0.3s ease-in-out;
}
</style>