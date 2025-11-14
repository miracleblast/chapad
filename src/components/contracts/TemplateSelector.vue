<template>
  <div class="template-selector">
    <!-- Search and Filters -->
    <div class="chapa-glass-card p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-3">
        <!-- Search -->
        <div class="flex items-center space-x-3 flex-1">
          <Icon icon="material-symbols:search" class="text-gray-400 text-xl" />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search templates..."
            class="input-modern flex-1 border-0 bg-transparent"
          >
        </div>
        
        <!-- Jurisdiction Filter -->
        <select 
          v-model="selectedJurisdiction"
          class="input-modern md:w-48 border-0 bg-transparent"
        >
          <option value="">All Regions</option>
          <optgroup label="Africa">
            <option v-for="country in targetCountries.africa" :key="country.code" :value="country.code">
              {{ country.name }}
            </option>
          </optgroup>
          <optgroup label="Asia">
            <option v-for="country in targetCountries.asia" :key="country.code" :value="country.code">
              {{ country.name }}
            </option>
          </optgroup>
        </select>

        <!-- Contract Type Filter -->
        <select 
          v-model="selectedContractType"
          class="input-modern md:w-40 border-0 bg-transparent"
        >
          <option value="">All Types</option>
          <option value="debt">Debt Agreements</option>
          <option value="sales">Sales</option>
          <option value="service">Services</option>
          <option value="partnership">Partnerships</option>
          <option value="mining">Mining</option>
          <option value="commodity">Commodity Trading</option>
          <option value="agriculture">Agriculture</option>
          <option value="import-export">Import/Export</option>
        </select>
      </div>
    </div>

    <!-- Templates Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="template in filteredTemplates"
        :key="template.id"
        class="chapa-glass-card p-5 card-hover"
        :class="{ 'border-2 border-chapa-purple-300': selectedTemplate?.id === template.id }"
        @click="selectTemplate(template)"
      >
        <!-- Template Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                 :class="getTypeColor(template.type).bg">
              <Icon :icon="getTypeIcon(template.type)" 
                    :class="getTypeColor(template.type).text" class="text-lg" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm">
                {{ template.title }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ getJurisdictionName(template.jurisdiction) }}
              </p>
            </div>
          </div>
          <div v-if="template.isOfficial" class="bg-chapa-purple-100 dark:bg-chapa-purple-900 text-chapa-purple-700 dark:text-chapa-purple-300 px-2 py-1 rounded-full text-xs">
            Official
          </div>
        </div>

        <!-- Template Description -->
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {{ template.description }}
        </p>

        <!-- Template Stats -->
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span class="flex items-center space-x-1">
            <Icon icon="material-symbols:download" />
            <span>{{ template.downloads }}</span>
          </span>
          <span class="flex items-center space-x-1">
            <Icon icon="material-symbols:star" />
            <span>{{ template.rating }}</span>
          </span>
          <span class="flex items-center space-x-1">
            <Icon icon="material-symbols:schedule" />
            <span>{{ getTemplateDuration(template.type) }}</span>
          </span>
        </div>

        <!-- Template Fields Preview -->
        <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {{ template.fields.length }} fields to fill
          </p>
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="field in template.fields.slice(0, 3)"
              :key="field.key"
              class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs"
            >
              {{ field.label }}
            </span>
            <span 
              v-if="template.fields.length > 3"
              class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs"
            >
              +{{ template.fields.length - 3 }} more
            </span>
          </div>
        </div>

        <!-- Legal Disclaimer -->
        <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-orange-600 dark:text-orange-400">
            ⚠️ Consult local legal experts for jurisdiction-specific requirements
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-if="filteredTemplates.length === 0"
      class="text-center py-12"
    >
      <Icon icon="material-symbols:search-off" class="text-6xl text-gray-300 dark:text-gray-600 mb-4 mx-auto" />
      <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2 font-poppins">
        No templates found
      </h3>
      <p class="text-gray-500 dark:text-gray-500 text-sm">
        Try adjusting your search or filter criteria
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { TemplateEngine, type ContractTemplate } from '@/utils/templates'

interface Props {
  contractType?: string
  initialTemplate?: string
}

const props = withDefaults(defineProps<Props>(), {
  contractType: '',
  initialTemplate: ''
})

const emit = defineEmits<{
  'select': [template: ContractTemplate]
}>()

// State
const searchQuery = ref('')
const selectedJurisdiction = ref('')
const selectedContractType = ref('')
const selectedTemplate = ref<ContractTemplate | null>(null)

// Countries data (same as in ContractBuilder)
const targetCountries = {
  africa: [
    // West Africa
    { code: 'NG', name: 'Nigeria', currency: 'NGN' },
    { code: 'GH', name: 'Ghana', currency: 'GHS' },
    { code: 'CI', name: 'Ivory Coast', currency: 'XOF' },
    { code: 'SN', name: 'Senegal', currency: 'XOF' },
    { code: 'TG', name: 'Togo', currency: 'XOF' },
    { code: 'BJ', name: 'Benin', currency: 'XOF' },
    { code: 'BF', name: 'Burkina Faso', currency: 'XOF' },
    { code: 'ML', name: 'Mali', currency: 'XOF' },
    { code: 'NE', name: 'Niger', currency: 'XOF' },
    { code: 'GN', name: 'Guinea', currency: 'GNF' },
    { code: 'GW', name: 'Guinea-Bissau', currency: 'XOF' },
    { code: 'LR', name: 'Liberia', currency: 'LRD' },
    { code: 'SL', name: 'Sierra Leone', currency: 'SLL' },
    { code: 'CM', name: 'Cameroon', currency: 'XAF' },
    { code: 'GA', name: 'Gabon', currency: 'XAF' },
    { code: 'CG', name: 'Congo Republic', currency: 'XAF' },
    { code: 'CD', name: 'DR Congo', currency: 'CDF' },
    { code: 'GQ', name: 'Equatorial Guinea', currency: 'XAF' },
    { code: 'CF', name: 'Central African Republic', currency: 'XAF' },
    { code: 'TD', name: 'Chad', currency: 'XAF' },

    // East Africa
    { code: 'KE', name: 'Kenya', currency: 'KES' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS' },
    { code: 'UG', name: 'Uganda', currency: 'UGX' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF' },
    { code: 'BI', name: 'Burundi', currency: 'BIF' },
    { code: 'ET', name: 'Ethiopia', currency: 'ETB' },
    { code: 'ER', name: 'Eritrea', currency: 'ERN' },
    { code: 'DJ', name: 'Djibouti', currency: 'DJF' },
    { code: 'SO', name: 'Somalia', currency: 'SOS' },
    { code: 'SS', name: 'South Sudan', currency: 'SSP' },
    { code: 'SD', name: 'Sudan', currency: 'SDG' },

    // Southern Africa
    { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
    { code: 'BW', name: 'Botswana', currency: 'BWP' },
    { code: 'NA', name: 'Namibia', currency: 'NAD' },
    { code: 'ZM', name: 'Zambia', currency: 'ZMW' },
    { code: 'ZW', name: 'Zimbabwe', currency: 'ZWL' },
    { code: 'MW', name: 'Malawi', currency: 'MWK' },
    { code: 'MZ', name: 'Mozambique', currency: 'MZN' },
    { code: 'AO', name: 'Angola', currency: 'AOA' },
    { code: 'SZ', name: 'Eswatini', currency: 'SZL' },
    { code: 'LS', name: 'Lesotho', currency: 'LSL' },
    { code: 'MG', name: 'Madagascar', currency: 'MGA' },
    { code: 'MU', name: 'Mauritius', currency: 'MUR' },
    { code: 'SC', name: 'Seychelles', currency: 'SCR' },
    { code: 'KM', name: 'Comoros', currency: 'KMF' },
    { code: 'RE', name: 'Réunion', currency: 'EUR' },
    { code: 'YT', name: 'Mayotte', currency: 'EUR' },

    // North Africa
    { code: 'EG', name: 'Egypt', currency: 'EGP' },
    { code: 'MA', name: 'Morocco', currency: 'MAD' },
    { code: 'DZ', name: 'Algeria', currency: 'DZD' },
    { code: 'TN', name: 'Tunisia', currency: 'TND' },
    { code: 'LY', name: 'Libya', currency: 'LYD' },
    { code: 'MR', name: 'Mauritania', currency: 'MRU' },
    { code: 'EH', name: 'Western Sahara', currency: 'MAD' }
  ],
  asia: [
    { code: 'CN', name: 'China', currency: 'CNY' },
    { code: 'IN', name: 'India', currency: 'INR' },
    { code: 'RU', name: 'Russia', currency: 'RUB' }
  ]
}

// All templates
const allTemplates = ref<ContractTemplate[]>([])

// Computed
const filteredTemplates = computed(() => {
  let templates = allTemplates.value

  // Filter by contract type if provided
  if (props.contractType) {
    templates = templates.filter(template => template.type === props.contractType)
  }

  // Filter by selected contract type
  if (selectedContractType.value) {
    templates = templates.filter(template => template.type === selectedContractType.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    templates = templates.filter(template =>
      template.title.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.jurisdiction.toLowerCase().includes(query) ||
      template.type.toLowerCase().includes(query)
    )
  }

  // Filter by jurisdiction
  if (selectedJurisdiction.value) {
    templates = templates.filter(template => template.jurisdiction === selectedJurisdiction.value)
  }

  return templates
})

// Methods
const getTypeIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    debt: 'material-symbols:money',
    sales: 'material-symbols:shopping-cart',
    service: 'material-symbols:design-services',
    partnership: 'material-symbols:handshake',
    'import-export': 'material-symbols:airport-shuttle',
    mining: 'material-symbols:minerals',
    commodity: 'material-symbols:warehouse',
    agriculture: 'material-symbols:agriculture',
    employment: 'material-symbols:work',
    nda: 'material-symbols:lock',
    custom: 'material-symbols:edit-document'
  }
  return icons[type] || 'material-symbols:description'
}

const getTypeColor = (type: string) => {
  const colors: { [key: string]: { bg: string; text: string } } = {
    debt: { bg: 'bg-chapa-orange-100 dark:bg-chapa-orange-900', text: 'text-chapa-orange-500' },
    sales: { bg: 'bg-chapa-purple-100 dark:bg-chapa-purple-900', text: 'text-chapa-purple-500' },
    service: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-500' },
    partnership: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-500' },
    'import-export': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-500' },
    mining: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-500' },
    commodity: { bg: 'bg-amber-100 dark:bg-amber-900', text: 'text-amber-500' },
    agriculture: { bg: 'bg-lime-100 dark:bg-lime-900', text: 'text-lime-500' },
    employment: { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-500' },
    nda: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-500' }
  }
  return colors[type] || { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-500' }
}

const getJurisdictionName = (jurisdiction: string) => {
  // Search in all countries
  for (const region of Object.values(targetCountries)) {
    const country = region.find(c => c.code === jurisdiction)
    if (country) return country.name
  }
  return jurisdiction
}

const getTemplateDuration = (type: string) => {
  const durations: { [key: string]: string } = {
    debt: '5-10 min',
    sales: '5-10 min',
    service: '10-15 min',
    partnership: '15-20 min',
    mining: '20-30 min',
    commodity: '15-25 min',
    agriculture: '10-20 min',
    'import-export': '15-25 min'
  }
  return durations[type] || '10-15 min'
}

const selectTemplate = (template: ContractTemplate) => {
  selectedTemplate.value = template
  emit('select', template)
}

// Initialize
onMounted(() => {
  // Load all templates
  allTemplates.value = TemplateEngine.getAllTemplates()

  // Select initial template if provided
  if (props.initialTemplate) {
    const template = TemplateEngine.getTemplateById(props.initialTemplate)
    if (template) {
      selectedTemplate.value = template
      emit('select', template)
    }
  }
})
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>