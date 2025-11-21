<template>
  <div class="min-h-screen bg-chapa-sand-50 dark:bg-gray-900 safe-top safe-bottom">
    <!-- MOBILE OPTIMIZED HEADER -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 safe-top">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <button @click="goBack" class="btn-ghost p-2 flex-shrink-0">
              <Icon icon="material-symbols:arrow-back" class="text-xl" />
            </button>
            <div class="min-w-0 flex-1">
              <h1 class="text-lg font-cal text-chapa-purple-600 dark:text-chapa-purple-300 truncate">
                {{ currentContractType?.name || 'Create Contract' }}
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-poppins truncate">
                Step {{ currentStep }} of {{ totalSteps }}
              </p>
            </div>
          </div>
          <button @click="saveDraft" class="btn-ghost p-2 flex-shrink-0">
            <Icon icon="material-symbols:save" class="text-xl" />
          </button>
        </div>
      </div>
    </div>

    <!-- PROGRESS BAR -->
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

    <!-- MAIN CONTENT WITH MOBILE OPTIMIZATIONS -->
    <div class="container mx-auto px-4 py-4 overflow-touch">
      <!-- Step 1: Contract Basics - MOBILE OPTIMIZED -->
      <div v-if="currentStep === 1" class="space-y-4">
        <!-- Validation Summary -->
        <div v-if="showErrors && !isStep1Valid" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mobile-padding">
          <div class="flex items-start space-x-3">
            <Icon icon="material-symbols:error" class="text-red-500 text-xl mt-0.5 flex-shrink-0" />
            <div>
              <h4 class="font-semibold text-red-800 dark:text-red-300 text-sm">Please complete all required fields</h4>
              <p class="text-red-700 dark:text-red-400 text-xs mt-1">Fill in the missing information above to continue</p>
            </div>
          </div>
        </div>

        <!-- Contract Title -->
        <div class="chapa-glass-card p-4 mobile-padding">
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
        </div>

        <!-- Parties Information -->
        <div class="chapa-glass-card p-4 mobile-padding">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
            Parties Involved
          </h3>
          
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

        <!-- Jurisdiction - MOBILE OPTIMIZED -->
        <div class="chapa-glass-card p-4 mobile-padding">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
            Jurisdiction & Currency
          </h3>
          
          <div class="grid mobile-stack gap-4">
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
                <option value="">Select your country</option>
                <optgroup label="🌍 Africa">
                  <option 
                    v-for="country in targetCountries.africa" 
                    :key="'first-' + country.code" 
                    :value="country.code"
                  >
                    {{ country.name }}
                  </option>
                </optgroup>
                <optgroup label="🌏 Asia">
                  <option 
                    v-for="country in targetCountries.asia" 
                    :key="'first-' + country.code" 
                    :value="country.code"
                  >
                    {{ country.name }}
                  </option>
                </optgroup>
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
                <option value="">Select their country</option>
                <optgroup label="🌍 Africa">
                  <option 
                    v-for="country in targetCountries.africa" 
                    :key="'second-' + country.code" 
                    :value="country.code"
                  >
                    {{ country.name }}
                  </option>
                </optgroup>
                <optgroup label="🌏 Asia">
                  <option 
                    v-for="country in targetCountries.asia" 
                    :key="'second-' + country.code" 
                    :value="country.code"
                  >
                    {{ country.name }}
                  </option>
                </optgroup>
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
              <option v-for="currency in availableCurrencies" :key="currency.code" :value="currency.code">
                {{ currency.symbol }} {{ currency.name }} ({{ currency.code }})
              </option>
            </select>
          </div>
        </div>

        <!-- Step 1 Navigation Buttons - MOBILE OPTIMIZED -->
        <div class="flex flex-col space-y-3 mt-6 safe-bottom">
          <button 
            @click="nextStep"
            :disabled="!isStep1Valid"
            class="btn-primary w-full justify-center"
            :class="{ 'opacity-50 cursor-not-allowed': !isStep1Valid }"
          >
            <span>Continue to Details</span>
            <Icon icon="material-symbols:arrow-forward" class="text-lg ml-2" />
          </button>
          
          <button @click="goBack" class="btn-secondary w-full justify-center">
            <Icon icon="material-symbols:arrow-back" class="text-lg mr-2" />
            <span>Back</span>
          </button>
        </div>
      </div>

     <!-- Step 2: Contract Details -->
<div v-if="currentStep === 2" class="space-y-6">
  <!-- Template Selection -->
  <div v-if="showTemplateSelector" class="chapa-glass-card p-5">
    <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
      Choose Detail Level
    </h3>
    
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="option in templateOptions"
        :key="option.id"
        @click="selectTemplateType(option.id)"
        class="p-4 rounded-xl border-2 transition-all text-center"
        :class="selectedTemplateType === option.id
          ? 'border-chapa-purple-500 bg-chapa-purple-50 dark:bg-chapa-purple-900/20 text-chapa-purple-700 dark:text-chapa-purple-300'
          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-chapa-purple-300'"
      >
        <Icon :icon="option.icon" class="text-xl mb-2 mx-auto" />
        <div class="text-xs font-medium">{{ option.name }}</div>
      </button>
    </div>
  </div>

  <!-- Dynamic Form Fields -->
  <div v-if="selectedTemplateType && selectedTemplateType !== 'none' && templateFields.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <ContractForm
        :templateFields="templateFields"
        :initialData="templateFormData"
        :showErrors="showErrors"
        @update:modelValue="handleTemplateFormUpdate"
        @validation="handleTemplateFormValidation"
      />
    </div>
    
    <!-- Live Preview -->
    <ContractPreview
      :contractData="contractData"
      :templateData="templateFormData"
    />
  </div>

  <!-- No Template Selected / Skip State -->
  <div v-else-if="currentStep === 2 && (!selectedTemplateType || selectedTemplateType === 'none')" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="text-center py-8 chapa-glass-card">
      <Icon icon="material-symbols:description" class="text-4xl text-gray-300 dark:text-gray-600 mb-3" />
      <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2 font-poppins">
        Contract Details
      </h3>
      <p class="text-gray-500 dark:text-gray-500 text-sm mb-6">
        {{ selectedTemplateType === 'none' ? 'Skipping additional details.' : 'Choose a detail level to add specific contract information' }}
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div class="text-center p-4">
          <Icon icon="material-symbols:auto-awesome" class="text-2xl text-chapa-purple-500 mb-2" />
          <p class="text-xs text-gray-600 dark:text-gray-400">Smart Templates</p>
        </div>
        <div class="text-center p-4">
          <Icon icon="material-symbols:bolt" class="text-2xl text-chapa-orange-500 mb-2" />
          <p class="text-xs text-gray-600 dark:text-gray-400">Quick Setup</p>
        </div>
        <div class="text-center p-4">
          <Icon icon="material-symbols:verified" class="text-2xl text-green-500 mb-2" />
          <p class="text-xs text-gray-600 dark:text-gray-400">Legally Sound</p>
        </div>
      </div>
    </div>
    
    <!-- Live Preview -->
    <ContractPreview
      :contractData="contractData"
      :templateData="templateFormData"
    />
  </div>

  <!-- Step 2 Navigation Buttons -->
  <div class="flex justify-center space-x-4 mt-8">
    <button @click="previousStep" class="btn-secondary flex items-center space-x-2 px-6 py-3">
      <Icon icon="material-symbols:arrow-back" class="text-lg" />
      <span>Back</span>
    </button>
    
    <button 
      @click="nextStep" 
      class="btn-accent flex items-center space-x-2 px-6 py-3"
      :class="{ 'opacity-50 cursor-not-allowed': selectedTemplateType && selectedTemplateType !== 'none' && !isStep2Valid }"
      :disabled="selectedTemplateType && selectedTemplateType !== 'none' && !isStep2Valid"
    >
      <span>Continue to Terms</span>
      <Icon icon="material-symbols:arrow-forward" class="text-lg" />
    </button>
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

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Terms Input -->
    <div class="space-y-4">
      <div class="chapa-glass-card p-5">
        <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
          Terms & Conditions *
        </h3>
        <textarea 
          v-model="contractData.terms"
          rows="12"
          placeholder="Enter the specific terms and conditions of this agreement..."
          class="input-modern w-full resize-none"
          :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && !contractData.terms?.trim() }"
        ></textarea>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Describe the rights, responsibilities, and obligations of both parties
        </p>
        
        <!-- Quick Template Buttons -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button 
            v-for="template in quickTemplates" 
            :key="template.id"
            @click="insertTemplate(template.content)"
            class="text-xs px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {{ template.name }}
          </button>
        </div>
      </div>

      <!-- Template Data Preview -->
      <div v-if="Object.keys(templateFormData).length > 0" class="chapa-glass-card p-5">
        <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
          Contract Details
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div 
            v-for="(value, key) in templateFormData" 
            :key="key"
            class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700"
          >
            <span class="text-gray-600 dark:text-gray-400 capitalize">{{ key.replace(/([A-Z])/g, ' $1').trim() }}:</span>
            <span class="text-gray-800 dark:text-white font-medium">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Live Preview -->
    <ContractPreview
      :contractData="contractData"
      :templateData="templateFormData"
    />
  </div>

  <!-- Legal Disclaimer -->
  <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
    <div class="flex items-start space-x-3">
      <Icon icon="material-symbols:warning" class="text-orange-500 text-xl mt-0.5 flex-shrink-0" />
      <div>
        <h4 class="font-semibold text-orange-800 dark:text-orange-300 text-sm">Legal Advisory</h4>
        <p class="text-orange-700 dark:text-orange-400 text-xs mt-1">
          This is a template document. Consult with qualified legal professionals in 
          {{ getCountryName(contractData.jurisdiction.firstCountry) }} and 
          {{ getCountryName(contractData.jurisdiction.secondCountry) }} 
          to ensure compliance with local laws and regulations.
        </p>
      </div>
    </div>
  </div>

  <!-- Step 3 Navigation Buttons -->
  <div class="flex justify-center space-x-4 mt-8">
    <button @click="previousStep" class="btn-secondary flex items-center space-x-2 px-6 py-3">
      <Icon icon="material-symbols:arrow-back" class="text-lg" />
      <span>Back</span>
    </button>
    
    <button 
      @click="nextStep"
      :disabled="!isStep3Valid"
      class="btn-accent flex items-center space-x-2 px-6 py-3"
      :class="{ 'opacity-50 cursor-not-allowed': !isStep3Valid }"
    >
      <span>Create Contract</span>
      <Icon icon="material-symbols:check" class="text-lg" />
    </button>
  </div>
</div>
   </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { useContractStore } from '@/stores/contracts'
import { TemplateEngine } from '@/utils/templates'
import ContractForm from '@/components/contracts/ContractForm.vue'
import ContractPreview from '@/components/contracts/ContractPreview.vue'

const router = useRouter()
const route = useRoute()
const contractStore = useContractStore()

// Step management
const currentStep = ref(1)
const totalSteps = 3
const showErrors = ref(false)

// Template system for Step 2
const showTemplateSelector = ref(true)
const selectedTemplateType = ref('')
const templateFormData = ref({})
const isStep2Valid = ref(true)

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
    // North Africa - Alphabetical
    { code: 'DZ', name: 'Algeria', currency: 'DZD' },
    { code: 'EG', name: 'Egypt', currency: 'EGP' },
    { code: 'LY', name: 'Libya', currency: 'LYD' },
    { code: 'MA', name: 'Morocco', currency: 'MAD' },
    { code: 'MR', name: 'Mauritania', currency: 'MRU' },
    { code: 'TN', name: 'Tunisia', currency: 'TND' },
    { code: 'EH', name: 'Western Sahara', currency: 'MAD' },
    
    // West Africa - Alphabetical
    { code: 'BJ', name: 'Benin', currency: 'XOF' },
    { code: 'BF', name: 'Burkina Faso', currency: 'XOF' },
    { code: 'CV', name: 'Cape Verde', currency: 'CVE' },
    { code: 'CI', name: 'Ivory Coast', currency: 'XOF' },
    { code: 'GM', name: 'Gambia', currency: 'GMD' },
    { code: 'GH', name: 'Ghana', currency: 'GHS' },
    { code: 'GN', name: 'Guinea', currency: 'GNF' },
    { code: 'GW', name: 'Guinea-Bissau', currency: 'XOF' },
    { code: 'LR', name: 'Liberia', currency: 'LRD' },
    { code: 'ML', name: 'Mali', currency: 'XOF' },
    { code: 'NE', name: 'Niger', currency: 'XOF' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN' },
    { code: 'SN', name: 'Senegal', currency: 'XOF' },
    { code: 'SL', name: 'Sierra Leone', currency: 'SLL' },
    { code: 'TG', name: 'Togo', currency: 'XOF' },
    
    // Central Africa - Alphabetical
    { code: 'AO', name: 'Angola', currency: 'AOA' },
    { code: 'CM', name: 'Cameroon', currency: 'XAF' },
    { code: 'CF', name: 'Central African Republic', currency: 'XAF' },
    { code: 'TD', name: 'Chad', currency: 'XAF' },
    { code: 'CG', name: 'Congo Republic', currency: 'XAF' },
    { code: 'CD', name: 'DR Congo', currency: 'CDF' },
    { code: 'GQ', name: 'Equatorial Guinea', currency: 'XAF' },
    { code: 'GA', name: 'Gabon', currency: 'XAF' },
    { code: 'ST', name: 'São Tomé and Príncipe', currency: 'STN' },
    
    // East Africa - Alphabetical
    { code: 'BI', name: 'Burundi', currency: 'BIF' },
    { code: 'KM', name: 'Comoros', currency: 'KMF' },
    { code: 'DJ', name: 'Djibouti', currency: 'DJF' },
    { code: 'ER', name: 'Eritrea', currency: 'ERN' },
    { code: 'ET', name: 'Ethiopia', currency: 'ETB' },
    { code: 'KE', name: 'Kenya', currency: 'KES' },
    { code: 'MG', name: 'Madagascar', currency: 'MGA' },
    { code: 'MW', name: 'Malawi', currency: 'MWK' },
    { code: 'MU', name: 'Mauritius', currency: 'MUR' },
    { code: 'YT', name: 'Mayotte', currency: 'EUR' },
    { code: 'MZ', name: 'Mozambique', currency: 'MZN' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF' },
    { code: 'RE', name: 'Réunion', currency: 'EUR' },
    { code: 'SC', name: 'Seychelles', currency: 'SCR' },
    { code: 'SO', name: 'Somalia', currency: 'SOS' },
    { code: 'SS', name: 'South Sudan', currency: 'SSP' },
    { code: 'SD', name: 'Sudan', currency: 'SDG' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS' },
    { code: 'UG', name: 'Uganda', currency: 'UGX' },
    { code: 'ZM', name: 'Zambia', currency: 'ZMW' },
    { code: 'ZW', name: 'Zimbabwe', currency: 'ZWL' },
    
    // Southern Africa - Alphabetical
    { code: 'BW', name: 'Botswana', currency: 'BWP' },
    { code: 'LS', name: 'Lesotho', currency: 'LSL' },
    { code: 'NA', name: 'Namibia', currency: 'NAD' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
    { code: 'SZ', name: 'Eswatini', currency: 'SZL' }
  ],
  asia: [
    { code: 'CN', name: 'China', currency: 'CNY' },
    { code: 'HK', name: 'Hong Kong SAR', currency: 'HKD' },
    { code: 'IN', name: 'India', currency: 'INR' },
    { code: 'RU', name: 'Russia', currency: 'RUB' }
  ]
}

const availableCurrencies = [
  // African Currencies
  { code: 'NGN', name: 'Naira', symbol: '₦' },
  { code: 'GHS', name: 'Ghana Cedi', symbol: 'GH₵' },
  { code: 'XOF', name: 'CFA Franc BCEAO', symbol: 'CFA' },
  { code: 'XAF', name: 'CFA Franc BEAC', symbol: 'FCFA' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw' },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj' },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'Sh.So.' },
  { code: 'SSP', name: 'South Sudanese Pound', symbol: '£' },
  { code: 'SDG', name: 'Sudanese Pound', symbol: '£SD' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK' },
  { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: 'Z$' },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK' },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT' },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz' },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'L' },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L' },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨' },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'CF' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'LD' },
  { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM' },
  
  // Additional African
  { code: 'GNF', name: 'Guinean Franc', symbol: 'FG' },
  { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$' },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le' },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'FC' },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk' },
  
  // Asian Currencies
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HKD$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  
  // International
  { code: 'USD', name: 'US Dollar', symbol: '$' }
]
// Contract types - EXPANDED for Africa + Asia trade
const contractTypes = {
  debt: { id: 'debt', name: 'Debt Agreement', icon: 'material-symbols:money' },
  sales: { id: 'sales', name: 'Sales Agreement', icon: 'material-symbols:shopping-cart' },
  service: { id: 'service', name: 'Service Contract', icon: 'material-symbols:design-services' },
  partnership: { id: 'partnership', name: 'Partnership Agreement', icon: 'material-symbols:handshake' },
  'import-export': { id: 'import-export', name: 'Import/Export Agreement', icon: 'material-symbols:airport-shuttle' },
  employment: { id: 'employment', name: 'Employment Contract', icon: 'material-symbols:work' },
  nda: { id: 'nda', name: 'Confidentiality Agreement', icon: 'material-symbols:lock' },
  lease: { id: 'lease', name: 'Lease Agreement', icon: 'material-symbols:real-estate-agent' },
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
  
  // Step 1 validation
  if (currentStep.value === 1) {
    showErrors.value = true
    if (!isStep1Valid.value) {
      console.log('❌ Step 1 validation failed')
      return
    }
    console.log('✅ Step 1 is valid! Proceeding to step 2')
  }

  // Step 2 validation (only if template requires it)
  if (currentStep.value === 2) {
    if (selectedTemplateType.value && selectedTemplateType.value !== 'none' && !isStep2Valid.value) {
      showErrors.value = true
      console.log('❌ Step 2 validation failed')
      return
    }
    console.log('✅ Step 2 validation passed or not required')
  }

  // Step 3 validation
  if (currentStep.value === 3 && !isStep3Valid.value) {
    showErrors.value = true
    console.log('❌ Step 3 validation failed')
    return
  }

  // Proceed to next step
  if (currentStep.value < totalSteps) {
    currentStep.value++
    showErrors.value = false
    
    // Mobile scroll to top
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
    
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
      // Auto-select quick template when coming from templates
      selectedTemplateType.value = 'quick'
      showTemplateSelector.value = false
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
      // For from-scratch, show template selector
      showTemplateSelector.value = true
    } else {
      // Default: show template selector
      showTemplateSelector.value = true
    }
  } else {
    contractData.value.type = 'custom'
    showTemplateSelector.value = true
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

const templateOptions = [
  { 
    id: 'quick', 
    name: 'Quick Setup', 
    icon: 'material-symbols:bolt',
    description: 'Ready-to-use template - just fill names and sign',
    type: 'ready-to-use'
  },
  { 
    id: 'detailed', 
    name: 'Detailed', 
    icon: 'material-symbols:description',
    description: 'Template with customizable fields',
    type: 'customizable' 
  },
  { 
    id: 'custom', 
    name: 'Custom Fields', 
    icon: 'material-symbols:edit',
    description: 'Build from scratch with full control',
    type: 'customizable'
  },
  { 
    id: 'none', 
    name: 'Skip Details', 
    icon: 'material-symbols:skip-next',
    description: 'Basic contract without extra fields',
    type: 'minimal'
  }
]
// Template fields based on contract type
const templateFields = computed(() => {
  // Only show fields for customizable templates (detailed and custom)
  if (!selectedTemplateType.value || 
      selectedTemplateType.value === 'quick' || 
      selectedTemplateType.value === 'none' || 
      !contractData.value.type) {
    return []
  }

  const baseFields: any[] = []
  
    switch (contractData.value.type) {
    case 'debt':
      baseFields.push(
        { key: 'loanAmount', label: 'Loan Amount', type: 'number', required: true, placeholder: 'Enter loan amount' },
        { key: 'interestRate', label: 'Interest Rate (%)', type: 'number', required: false, placeholder: 'Annual interest rate' },
        { key: 'repaymentMonths', label: 'Repayment Period (Months)', type: 'number', required: true, placeholder: 'Number of months' }
      )
      break

    case 'sales':
      baseFields.push(
        { key: 'goodsDescription', label: 'Goods Description', type: 'textarea', required: true, placeholder: 'Detailed description of goods' },
        { key: 'quantity', label: 'Quantity', type: 'number', required: true, placeholder: 'Number of units' },
        { key: 'unitPrice', label: 'Unit Price', type: 'number', required: true, placeholder: 'Price per unit' },
        { key: 'deliveryDate', label: 'Delivery Date', type: 'date', required: true },
        { key: 'deliveryTerms', label: 'Delivery Terms', type: 'select', required: true, options: ['FOB', 'CIF', 'EXW', 'DAP'] },
        { key: 'warrantyPeriod', label: 'Warranty Period (Months)', type: 'number', required: false, placeholder: 'Warranty in months' }
      )
      break

    case 'mining':
      baseFields.push(
        { key: 'mineralType', label: 'Mineral Type', type: 'select', required: true, options: ['Gold', 'Diamond', 'Copper', 'Cobalt', 'Bauxite', 'Manganese', 'Other'] },
        { key: 'miningArea', label: 'Mining Area Coordinates', type: 'textarea', required: true, placeholder: 'GPS coordinates of mining area' },
        { key: 'licenseTerm', label: 'License Term (Years)', type: 'number', required: true },
        { key: 'royaltyRate', label: 'Royalty Rate (%)', type: 'number', required: true },
        { key: 'environmentalBond', label: 'Environmental Bond Amount', type: 'number', required: true },
        { key: 'localEmployment', label: 'Local Employment Percentage (%)', type: 'number', required: true }
      )
      break

    case 'commodity':
      baseFields.push(
        { key: 'commodityType', label: 'Commodity Type', type: 'select', required: true, options: ['Cocoa', 'Coffee', 'Cotton', 'Palm Oil', 'Cashew', 'Gold', 'Copper', 'Crude Oil'] },
        { key: 'qualityStandards', label: 'Quality Standards', type: 'textarea', required: true },
        { key: 'quantity', label: 'Quantity', type: 'number', required: true },
        { key: 'units', label: 'Units', type: 'select', required: true, options: ['Metric Tons', 'Barrels', 'Kilograms', 'Bags'] },
        { key: 'unitPrice', label: 'Unit Price', type: 'number', required: true },
        { key: 'priceBasis', label: 'Price Basis', type: 'select', required: true, options: ['FOB', 'CIF', 'CFR', 'EXW'] },
        { key: 'deliveryPeriod', label: 'Delivery Period', type: 'text', required: true }
      )
      break

    case 'agriculture':
      baseFields.push(
        { key: 'agriculturalProduct', label: 'Agricultural Product', type: 'select', required: true, options: ['Coffee', 'Tea', 'Cocoa', 'Fruits', 'Vegetables', 'Grains', 'Livestock'] },
        { key: 'productVariety', label: 'Product Variety', type: 'text', required: true },
        { key: 'qualityGrade', label: 'Quality Grade', type: 'select', required: true, options: ['Grade A', 'Grade B', 'Export Quality', 'Local Market'] },
        { key: 'organicStatus', label: 'Organic Certification', type: 'select', required: true, options: ['Certified Organic', 'In Conversion', 'Conventional'] },
        { key: 'totalQuantity', label: 'Total Quantity', type: 'number', required: true },
        { key: 'deliverySchedule', label: 'Delivery Schedule', type: 'textarea', required: true }
      )
      break

    case 'import-export':
      baseFields.push(
        { key: 'productDescription', label: 'Product Description', type: 'textarea', required: true },
        { key: 'quantity', label: 'Quantity', type: 'number', required: true },
        { key: 'unitPrice', label: 'Unit Price (USD)', type: 'number', required: true },
        { key: 'incoterms', label: 'Incoterms', type: 'select', required: true, options: ['EXW', 'FCA', 'FOB', 'CIF', 'CFR', 'DAP', 'DDP'] },
        { key: 'originCountry', label: 'Country of Origin', type: 'text', required: true },
        { key: 'destinationCountry', label: 'Destination Country', type: 'text', required: true },
        { key: 'shipmentDate', label: 'Latest Shipment Date', type: 'date', required: true },
        { key: 'paymentMethod', label: 'Payment Method', type: 'select', required: true, options: ['Letter of Credit', 'Telegraphic Transfer', 'Document Against Acceptance', 'Advance Payment'] }
      )
      break
  }

  return baseFields
})

const selectTemplateType = (type: string) => {
  selectedTemplateType.value = type
  showTemplateSelector.value = false
  
  console.log('Selected template type:', type)
  
  // Handle different template types
  if (type === 'quick') {
    // Ready-to-use: Pre-fill with basic template
    loadQuickTemplate()
    isStep2Valid.value = true // Always valid for ready-to-use
  } else if (type === 'detailed' || type === 'custom') {
    // Customizable: Show form fields
    initializeCustomFields()
    // Validation will be handled by the form
  } else if (type === 'none') {
    // Minimal: Skip additional details
    templateFormData.value = {}
    isStep2Valid.value = true
  }
}

const loadQuickTemplate = () => {
  // Pre-fill with a basic template for quick setup
  const quickTemplates = {
    debt: `DEBT AGREEMENT

This Debt Agreement is made between [First Party] and [Second Party].

BASIC TERMS:
1. Loan Amount: [Amount] [Currency]
2. Repayment Terms: As agreed between parties
3. Governing Law: Laws of applicable jurisdiction

Both parties agree to the terms above.`,
    sales: `SALES AGREEMENT

This Sales Agreement is made between [First Party] and [Second Party].

BASIC TERMS:
1. Goods/Services: [Description]
2. Price: [Amount] [Currency] 
3. Delivery: As agreed between parties

Both parties agree to the terms above.`,
    service: `SERVICE AGREEMENT

This Service Agreement is made between [First Party] and [Second Party].

BASIC TERMS:
1. Services: [Description]
2. Compensation: [Amount] [Currency]
3. Term: As agreed between parties

Both parties agree to the terms above.`
  }
  
  const template = quickTemplates[contractData.value.type as keyof typeof quickTemplates]
  if (template) {
    contractData.value.terms = template
  }
  
  // No additional fields for quick templates
  templateFormData.value = {}
}

const initializeCustomFields = () => {
  // Reset form data for custom fields
  templateFormData.value = {}
  // The templateFields computed property will automatically populate
}

const handleTemplateFormUpdate = (data: any) => {
  templateFormData.value = data
  // Store template data in contract data
  contractData.value.clauses = Object.entries(data)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
}

const handleTemplateFormValidation = (isValid: boolean) => {
  isStep2Valid.value = isValid
  console.log('Step 2 validation updated:', isValid)
}

// Helper function to get country name
const getCountryName = (countryCode: string) => {
  const allCountries = [...targetCountries.africa, ...targetCountries.asia]
  const country = allCountries.find(c => c.code === countryCode)
  return country?.name || countryCode
}
// Quick templates for Step 3
const quickTemplates = [
  {
    id: 'standard-clause',
    name: 'Standard Clause',
    content: `This Agreement shall be governed by and construed in accordance with the laws of ${contractData.value.jurisdiction.firstCountry || '[Your Country]'}.\n\nAny dispute arising out of or in connection with this Agreement shall be referred to arbitration in accordance with the rules of the relevant arbitration association.`
  },
  {
    id: 'payment-terms',
    name: 'Payment Terms',
    content: `Payment shall be made within ${templateFormData.value.paymentDays || '30'} days of invoice date. Late payments shall bear interest at the rate of ${templateFormData.value.lateFeeRate || '1.5'}% per month.`
  },
  {
    id: 'confidentiality',
    name: 'Confidentiality',
    content: `Both parties agree to maintain the confidentiality of all proprietary information received from the other party. This obligation shall survive the termination of this Agreement.`
  },
  {
    id: 'termination',
    name: 'Termination',
    content: `Either party may terminate this Agreement with ${templateFormData.value.noticePeriod || '30'} days written notice. Upon termination, all outstanding obligations shall become immediately due and payable.`
  }
]

const insertTemplate = (content: string) => {
  contractData.value.terms += '\n\n' + content
}

// Fix proxy cloning issue in createContract
const createContract = async () => {
  console.log('Creating contract:', contractData.value)
  
  try {
    // Create a plain object to avoid proxy issues
    const contractToSave = {
      ...JSON.parse(JSON.stringify(contractData.value)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Create contract using the store
    const newContract = await contractStore.createContract(contractToSave)
    console.log('Contract created successfully:', newContract)
    
    // Show success notification
    showSuccessNotification('Contract saved to My Documents!')
    
    // Navigate to signature page with the new contract ID
    setTimeout(() => {
      router.push({
        path: '/signature',
        query: { contractId: newContract.id }
      })
    }, 1500)
    
  } catch (error) {
    console.error('Failed to create contract:', error)
    showErrorNotification('Failed to create contract. Please try again.')
  }
}

const showSuccessNotification = (message: string) => {
  // Simple notification - you can enhance this with the Notification component
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-poppins text-sm'
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}

const showErrorNotification = (message: string) => {
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg font-poppins text-sm'
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}


onMounted(() => {
  // Add mobile-specific optimizations
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    console.log('Mobile device detected - applying mobile optimizations')
    
    // Fix viewport height
    const setVH = () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    setVH()
    window.addEventListener('resize', setVH)
    
    // Clean up event listener on unmount
    onUnmounted(() => {
      window.removeEventListener('resize', setVH)
    })
  }
})


const fixMobileNavigation = () => {
  const cleanupNavigation = () => {
    showErrors.value = false
  }

  const unsubscribe = router.beforeEach((to, from, next) => {
    cleanupNavigation()
    next()
  })

  return () => {
    unsubscribe() // Clean up the router listener
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