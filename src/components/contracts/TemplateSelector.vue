<template>
  <div class="template-selector">
    <!-- Search Bar -->
    <div class="chapa-glass-card p-4 mb-6">
      <div class="flex items-center space-x-3">
        <Icon icon="material-symbols:search" class="text-gray-400 text-xl" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search templates..."
          class="input-modern flex-1 border-0 bg-transparent"
        >
        <select 
          v-model="selectedJurisdiction"
          class="input-modern w-32 border-0 bg-transparent"
        >
          <option value="">All Regions</option>
          <option value="NG">Nigeria</option>
          <option value="KE">Kenya</option>
          <option value="GH">Ghana</option>
          <option value="ZA">South Africa</option>
          <option value="CN">China</option>
          <option value="IN">India</option>
          <option value="RU">Russia</option>
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
const selectedTemplate = ref<ContractTemplate | null>(null)
const allTemplates = ref<ContractTemplate[]>([])

// Computed
const filteredTemplates = computed(() => {
  let templates = allTemplates.value

  // Filter by contract type if provided
  if (props.contractType) {
    templates = templates.filter(template => template.type === props.contractType)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    templates = templates.filter(template =>
      template.title.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.jurisdiction.toLowerCase().includes(query)
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
    partnership: 'material-symbols:handshake'
  }
  return icons[type] || 'material-symbols:description'
}

const getTypeColor = (type: string) => {
  const colors: { [key: string]: { bg: string; text: string } } = {
    debt: { bg: 'bg-chapa-orange-100 dark:bg-chapa-orange-900', text: 'text-chapa-orange-500' },
    sales: { bg: 'bg-chapa-purple-100 dark:bg-chapa-purple-900', text: 'text-chapa-purple-500' },
    service: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-500' },
    partnership: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-500' }
  }
  return colors[type] || { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-500' }
}

const getJurisdictionName = (jurisdiction: string) => {
  const names: { [key: string]: string } = {
    NG: 'Nigeria',
    KE: 'Kenya',
    GH: 'Ghana',
    ZA: 'South Africa',
    CN: 'China',
    IN: 'India',
    RU: 'Russia'
  }
  return names[jurisdiction] || jurisdiction
}

const getTemplateDuration = (type: string) => {
  const durations: { [key: string]: string } = {
    debt: '5-10 min',
    sales: '5-10 min',
    service: '10-15 min',
    partnership: '15-20 min'
  }
  return durations[type] || '10 min'
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