<!-- Templates.vue - The REAL template gallery -->
<template>
  <div class="min-h-screen bg-chapa-sand-50 dark:bg-gray-900 pb-24">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-cal text-chapa-purple-600 dark:text-chapa-purple-300 mb-1">
              Contract Templates
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-poppins">
              {{ filteredTemplates.length }} templates available
              <span v-if="selectedType"> · Filtered by {{ getTypeName(selectedType) }}</span>
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="clearFilters" v-if="selectedType" class="btn-ghost p-2">
              <Icon icon="material-symbols:close" class="text-lg" />
            </button>
            <RouterLink to="/select-type" class="btn-ghost p-2">
              <Icon icon="material-symbols:filter-alt" class="text-lg" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Gallery -->
    <div class="container mx-auto px-4 py-6">
      <!-- Community Templates -->
      <div class="mb-8" v-if="filteredCommunityTemplates.length > 0">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins flex items-center space-x-2">
          <Icon icon="material-symbols:group" class="text-chapa-orange-500" />
          <span>Community Templates</span>
          <span class="text-xs bg-chapa-orange-100 dark:bg-chapa-orange-900 text-chapa-orange-700 dark:text-chapa-orange-300 px-2 py-1 rounded-full">
            {{ filteredCommunityTemplates.length }}
          </span>
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="template in filteredCommunityTemplates" 
            :key="template.id"
            class="chapa-glass-card p-5 card-hover"
            @click="useTemplate(template)"
          >
            <div class="flex items-start space-x-3 mb-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                   :class="getTypeColor(template.type).bg">
                <Icon :icon="getTypeIcon(template.type)" 
                      :class="getTypeColor(template.type).text" class="text-lg" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm">
                  {{ template.title }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  By {{ template.contributor.name }}
                </p>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {{ template.description }}
            </p>
            
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span class="flex items-center space-x-1">
                <Icon icon="material-symbols:location-on" />
                <span>{{ getJurisdictionName(template.jurisdiction) }}</span>
              </span>
              <span class="flex items-center space-x-1">
                <Icon icon="material-symbols:download" />
                <span>{{ template.downloads }} downloads</span>
              </span>
            </div>
            
            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <span class="text-xs text-chapa-purple-500 font-medium">
                  {{ getTypeName(template.type) }}
                </span>
                <span class="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Official Templates -->
      <div class="mb-8" v-if="filteredOfficialTemplates.length > 0">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins flex items-center space-x-2">
          <Icon icon="material-symbols:verified" class="text-chapa-purple-500" />
          <span>Official ChapaDocs Templates</span>
          <span class="text-xs bg-chapa-purple-100 dark:bg-chapa-purple-900 text-chapa-purple-700 dark:text-chapa-purple-300 px-2 py-1 rounded-full">
            {{ filteredOfficialTemplates.length }}
          </span>
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="template in filteredOfficialTemplates" 
            :key="template.id"
            class="chapa-glass-card p-5 card-hover border-2 border-chapa-purple-200 dark:border-chapa-purple-800"
            @click="useTemplate(template)"
          >
            <div class="flex items-start space-x-3 mb-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-chapa-purple-100 dark:bg-chapa-purple-900">
                <Icon :icon="getTypeIcon(template.type)" class="text-chapa-purple-500 text-lg" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm">
                  {{ template.title }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Official Template
                </p>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {{ template.description }}
            </p>
            
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span class="flex items-center space-x-1">
                <Icon icon="material-symbols:schedule" />
                <span>{{ template.duration }}</span>
              </span>
              <span class="flex items-center space-x-1">
                <Icon icon="material-symbols:thumb-up" />
                <span>{{ template.usage }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTemplates.length === 0" class="text-center py-12">
        <Icon icon="material-symbols:search-off" class="text-6xl text-gray-300 dark:text-gray-600 mb-4 mx-auto" />
        <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2 font-poppins">
          No templates found
        </h3>
        <p class="text-gray-500 dark:text-gray-500 text-sm mb-4">
          {{ selectedType ? `No ${getTypeName(selectedType)} templates available` : 'No templates available' }}
        </p>
        <button @click="clearFilters" class="btn-primary">
          Show All Templates
        </button>
      </div>
    </div>

    <!-- Floating Action Button -->
    <RouterLink 
      to="/select-type" 
      class="fixed bottom-24 right-4 w-14 h-14 bg-chapa-purple-500 hover:bg-chapa-purple-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-chapa-purple-500/25 transition-all duration-300 hover:scale-110"
    >
      <Icon icon="material-symbols:add" class="text-2xl" />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, onMounted, watch } from 'vue'

const router = useRouter()
const route = useRoute()

// Get selected type from route query
const selectedType = ref(route.query.type as string)

// Watch for route changes to update the filter
watch(() => route.query.type, (newType) => {
  selectedType.value = newType as string
})

// Sample template data - in real app, this would come from your TemplateEngine
const communityTemplates = [
  {
    id: 'debt-ng-1',
    title: 'Nigeria Debt Recovery Agreement',
    type: 'debt',
    description: 'Comprehensive debt agreement tailored for Nigerian jurisdiction with clear recovery terms.',
    contributor: { name: 'ABC Law Partners', verified: true },
    jurisdiction: 'NG',
    downloads: 245,
    rating: 4.8
  },
  {
    id: 'sales-ke-1', 
    title: 'Kenya Sales Contract Template',
    type: 'sales',
    description: 'Sales agreement optimized for Kenyan business regulations and tax requirements.',
    contributor: { name: 'John Mwangi', verified: true },
    jurisdiction: 'KE', 
    downloads: 187,
    rating: 4.6
  },
  {
    id: 'service-za-1',
    title: 'South Africa Consulting Agreement',
    type: 'service',
    description: 'Professional services contract for consulting work in South Africa.',
    contributor: { name: 'Cape Legal Firm', verified: true },
    jurisdiction: 'ZA',
    downloads: 132,
    rating: 4.7
  },
  {
    id: 'partnership-gh-1',
    title: 'Ghana Business Partnership',
    type: 'partnership',
    description: 'Partnership agreement for Ghanaian businesses with profit-sharing terms.',
    contributor: { name: 'Accra Business Group', verified: true },
    jurisdiction: 'GH',
    downloads: 98,
    rating: 4.5
  }
]

const officialTemplates = [
  {
    id: 'debt-official-ng',
    title: 'Standard Debt Agreement - Nigeria',
    type: 'debt',
    description: 'Professional debt agreement with flexible repayment terms and interest options.',
    duration: '5-10 min',
    usage: '87% used',
    jurisdiction: 'NG'
  },
  {
    id: 'sales-official-ke',
    title: 'Basic Sales Agreement - Kenya', 
    type: 'sales',
    description: 'Simple sales contract for goods and services with standard terms.',
    duration: '5-10 min',
    usage: '65% used',
    jurisdiction: 'KE'
  },
  {
    id: 'service-official-za',
    title: 'Service Contract - South Africa',
    type: 'service',
    description: 'Comprehensive service agreement for professional services.',
    duration: '10-15 min',
    usage: '58% used',
    jurisdiction: 'ZA'
  },
  {
    id: 'partnership-official-gh',
    title: 'Partnership Agreement - Ghana',
    type: 'partnership',
    description: 'Business partnership agreement with clear roles and responsibilities.',
    duration: '15-20 min',
    usage: '42% used',
    jurisdiction: 'GH'
  }
]

// Filter templates based on selected type
const filteredCommunityTemplates = computed(() => {
  if (selectedType.value) {
    return communityTemplates.filter(template => template.type === selectedType.value)
  }
  return communityTemplates
})

const filteredOfficialTemplates = computed(() => {
  if (selectedType.value) {
    return officialTemplates.filter(template => template.type === selectedType.value)
  }
  return officialTemplates
})

const filteredTemplates = computed(() => {
  return [...filteredOfficialTemplates.value, ...filteredCommunityTemplates.value]
})

// Helper methods
const getTypeName = (type: string) => {
  const typeNames: { [key: string]: string } = {
    debt: 'Debt Agreement',
    sales: 'Sales Agreement',
    service: 'Service Contract',
    partnership: 'Partnership Agreement',
    'import-export': 'Import/Export',
    employment: 'Employment',
    nda: 'Confidentiality',
    custom: 'Custom Contract'
  }
  return typeNames[type] || type
}

const getTypeIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    debt: 'material-symbols:money',
    sales: 'material-symbols:shopping-cart',
    service: 'material-symbols:design-services',
    partnership: 'material-symbols:handshake',
    'import-export': 'material-symbols:airport-shuttle',
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
    employment: { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-500' },
    nda: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-500' }
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

// Template usage
const useTemplate = (template: any) => {
  console.log('Using template:', template)
  router.push({
    path: '/builder',
    query: { 
      type: template.type,
      template: template.id,
      title: template.title
    }
  })
}

const clearFilters = () => {
  selectedType.value = ''
  router.push('/templates')
}

onMounted(() => {
  console.log('Templates mounted with type:', selectedType.value)
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