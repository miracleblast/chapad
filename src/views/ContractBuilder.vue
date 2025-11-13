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
    <div class="container mx-auto px-4 py-6 pb-24">
      <!-- Step 1: Contract Basics -->
      <div v-if="currentStep === 1" class="space-y-6">
        <!-- Validation Summary - MOVED TO TOP -->
        <div v-if="showErrors && !isStep1Valid" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <Icon icon="material-symbols:error" class="text-red-500 text-xl mt-0.5 flex-shrink-0" />
            <div>
              <h4 class="font-semibold text-red-800 dark:text-red-300 text-sm">Please complete all required fields</h4>
              <p class="text-red-700 dark:text-red-400 text-xs mt-1">Fill in the missing information above to continue</p>
              <!-- Detailed error list -->
              <ul class="text-xs text-red-600 dark:text-red-400 mt-2 space-y-1">
                <li v-if="!contractData.title?.trim()">• Contract title is required</li>
                <li v-if="!contractData.parties.firstParty.name?.trim()">• First party name is required</li>
                <li v-if="!contractData.parties.secondParty.name?.trim()">• Second party name is required</li>
                <li v-if="!contractData.jurisdiction.firstCountry">• Your country is required</li>
                <li v-if="!contractData.jurisdiction.secondCountry">• Their country is required</li>
                <li v-if="!contractData.jurisdiction.currency">• Currency is required</li>
              </ul>
            </div>
          </div>
        </div>

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

        <!-- Manual Validation Button -->
        <div class="flex justify-center mt-6">
          <button 
            @click="validateStep1"
            class="btn-accent flex items-center space-x-2 px-6 py-2"
          >
            <Icon icon="material-symbols:check" class="text-lg" />
            <span>Validate Step 1</span>
          </button>
        </div>
      </div>

      <!-- Step 2: Contract Details -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div class="text-center py-8">
          <Icon icon="material-symbols:check-circle" class="text-4xl text-green-500 mb-3" />
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 font-poppins">
            Step 2: Contract Details
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            This step is optional for now. You can proceed to terms.
          </p>
        </div>
      </div>

      <!-- Step 3: Terms & Conditions -->
      <div v-if="currentStep === 3" class="space-y-6">
        <!-- Validation Summary for Step 3 -->
        <div v-if="showErrors && !isStep3Valid" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <Icon icon="material-symbols:error" class="text-red-500 text-xl mt-0.5 flex-shrink-0" />
            <div>
              <h4 class="font-semibold text-red-800 dark:text-red-300 text-sm">Terms are required</h4>
              <p class="text-red-700 dark:text-red-400 text-xs mt-1">Please add some terms and conditions to continue</p>
            </div>
          </div>
        </div>

        <div class="chapa-glass-card p-5">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
            Terms & Conditions *
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

        <!-- Manual Validation Button for Step 3 -->
        <div class="flex justify-center mt-6">
          <button 
            @click="validateStep3"
            class="btn-accent flex items-center space-x-2 px-6 py-2"
          >
            <Icon icon="material-symbols:check" class="text-lg" />
            <span>Validate Terms</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation Footer - COMPACT -->
    <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3">
      <div class="container mx-auto">
        <div class="flex space-x-2">
          <button 
            v-if="currentStep > 1"
            @click="previousStep"
            class="btn-secondary flex-1 flex items-center justify-center space-x-1 py-2 text-sm"
          >
            <Icon icon="material-symbols:arrow-back" class="text-base" />
            <span class="font-poppins font-medium">Back</span>
          </button>
          
          <button 
            @click="nextStep"
            :disabled="(currentStep === 1 && !isStep1Valid) || (currentStep === 3 && !isStep3Valid)"
            class="flex-1 flex items-center justify-center space-x-1 py-2 text-sm font-poppins font-medium transition-all duration-300"
            :class="getNextButtonClass()"
          >
            <span>{{ getNextButtonText() }}</span>
            <Icon 
              :icon="currentStep === totalSteps ? 'material-symbols:check' : 'material-symbols:arrow-forward'" 
              class="text-base" 
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useContractStore } from '@/stores/contracts'
import { TemplateEngine } from '@/utils/templates'

const router = useRouter()
const route = useRoute()
const contractStore = useContractStore()

// Step management
const currentStep = ref(1)
const totalSteps = 3
const showErrors = ref(false)

// Contract data - FIXED: Use proper structure that matches your Contract interface
const contractData = ref({
  id: '',
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
  status: 'draft' as 'draft' | 'active' | 'completed' | 'cancelled',
  createdAt: '',
  updatedAt: '',
  signatures: {
    firstParty: undefined as { signature: string; signedAt: string } | undefined,
    secondParty: undefined as { signature: string; signedAt: string } | undefined
  }
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
  partnership: { id: 'partnership', name: 'Partnership Agreement', icon: 'material-symbols:handshake' },
  custom: { id: 'custom', name: 'Custom Contract', icon: 'material-symbols:edit-document' }
}

const currentContractType = computed(() => {
  const type = route.query.type as string
  console.log('Route query type:', type)
  return contractTypes[type as keyof typeof contractTypes] || contractTypes.custom
})

// Validation - FIXED
const isStep1Valid = computed(() => {
  const valid = (
    contractData.value.title?.trim() &&
    contractData.value.parties.firstParty.name?.trim() &&
    contractData.value.parties.secondParty.name?.trim() &&
    contractData.value.jurisdiction.firstCountry &&
    contractData.value.jurisdiction.secondCountry &&
    contractData.value.jurisdiction.currency
  )
  console.log('Step 1 validation:', valid, {
    title: contractData.value.title?.trim(),
    firstParty: contractData.value.parties.firstParty.name?.trim(),
    secondParty: contractData.value.parties.secondParty.name?.trim(),
    firstCountry: contractData.value.jurisdiction.firstCountry,
    secondCountry: contractData.value.jurisdiction.secondCountry,
    currency: contractData.value.jurisdiction.currency
  })
  return valid
})

const isStep3Valid = computed(() => {
  const valid = contractData.value.terms?.trim()
  console.log('Step 3 validation:', valid)
  return valid
})

// Manual validation functions
const validateStep1 = () => {
  showErrors.value = true
  if (isStep1Valid.value) {
    console.log('✅ Step 1 is valid! You can proceed.')
    // Auto-proceed to step 2 if valid
    nextStep()
  } else {
    console.log('❌ Step 1 validation failed')
  }
}

const validateStep3 = () => {
  showErrors.value = true
  if (isStep3Valid.value) {
    console.log('✅ Terms are valid! You can proceed.')
    // Auto-proceed to create contract if valid
    nextStep()
  } else {
    console.log('❌ Terms validation failed')
  }
}

// Navigation - FIXED
const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    showErrors.value = false
    console.log('🔙 Going back to step:', currentStep.value)
  } else {
    router.push('/select-type')
  }
}

const nextStep = () => {
  console.log('Next step clicked - Current step:', currentStep.value)
  
  // Validate current step before proceeding
  if (currentStep.value === 1 && !isStep1Valid.value) {
    console.log('❌ Step 1 validation failed - showing errors')
    showErrors.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  if (currentStep.value === 3 && !isStep3Valid.value) {
    console.log('❌ Step 3 validation failed - showing errors')
    showErrors.value = true
    return
  }

  if (currentStep.value < totalSteps) {
    currentStep.value++
    showErrors.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
    console.log('✅ Moving to step:', currentStep.value)
  } else {
    createContract()
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    showErrors.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
    console.log('🔙 Going back to step:', currentStep.value)
  }
}

const getNextButtonClass = () => {
  if ((currentStep.value === 1 && !isStep1Valid.value) || (currentStep.value === 3 && !isStep3Valid.value)) {
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

// Other methods
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
    debt: `DEBT AGREEMENT\n\nThis Debt Agreement is made between [First Party] and [Second Party].\n\n1. LOAN AMOUNT: [Amount] [Currency]\n2. INTEREST RATE: [Rate]% per annum\n3. REPAYMENT: [Months] months\n4. DEFAULT: Consequences as per applicable laws.`,
    sales: `SALES AGREEMENT\n\nThis Sales Agreement is made between [First Party] and [Second Party].\n\n1. GOODS: [Description]\n2. PRICE: [Amount] [Currency]  \n3. DELIVERY: As agreed by both parties\n4. PAYMENT: Terms to be specified.`
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

const createContract = async () => {
  console.log('Creating contract:', contractData.value)
  
  try {
    // Set creation date
    contractData.value.createdAt = new Date().toISOString()
    contractData.value.updatedAt = new Date().toISOString()
    
    // Create contract using the store
    const newContract = await contractStore.createContract(contractData.value)
    console.log('Contract created successfully:', newContract)
    
    // Navigate to signature page with the new contract ID
    router.push({
      path: '/signature',
      query: { contractId: newContract.id }
    })
  } catch (error) {
    console.error('Failed to create contract:', error)
    alert('Failed to create contract. Please try again.')
  }
}

// Watch for step changes to debug
watch(currentStep, (newStep) => {
  console.log('🔍 Step changed to:', newStep)
})

onMounted(() => {
  console.log('ContractBuilder mounted')
  
  // Set contract type from route
  if (route.query.type) {
    contractData.value.type = route.query.type as string
    console.log('Set contract type to:', contractData.value.type)
    
    // Load template if specified
    if (route.query.template && route.query.template !== 'true') {
      loadSpecificTemplate(route.query.template as string)
    }
    // Set title for from-scratch contracts
    else if (route.query.fromScratch === 'true') {
      const typeNames: { [key: string]: string } = {
        debt: 'Debt Agreement',
        sales: 'Sales Agreement',
        service: 'Service Contract',
        partnership: 'Partnership Agreement',
        custom: 'Custom Contract'
      }
      contractData.value.title = `${typeNames[route.query.type as string] || route.query.type} - ${new Date().toLocaleDateString()}`
    }
  } else {
    contractData.value.type = 'custom'
  }
  
  // Load draft
  const draft = localStorage.getItem('contractDraft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      if (!route.query.type || draftData.type === route.query.type) {
        contractData.value = { ...contractData.value, ...draftData }
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
  }
})

const loadSpecificTemplate = (templateId: string) => {
  console.log('Loading template:', templateId)
  const template = TemplateEngine.getTemplateById(templateId)
  
  if (template) {
    console.log('Template found:', template)
    if (template.content) {
      contractData.value.terms = template.content
    }
    if (template.title) {
      contractData.value.title = template.title
    }
  } else {
    console.warn('Template not found:', templateId)
    const typeNames: { [key: string]: string } = {
      debt: 'Debt Agreement',
      sales: 'Sales Agreement', 
      service: 'Service Contract',
      partnership: 'Partnership Agreement',
      custom: 'Custom Contract'
    }
    contractData.value.title = `${typeNames[contractData.value.type] || contractData.value.type} Template`
    contractData.value.terms = `This is a ${contractData.value.type} agreement template. Fill in the details below.`
  }
}
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