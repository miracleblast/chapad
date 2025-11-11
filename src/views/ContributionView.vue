<template>
  <div class="min-h-screen bg-chapa-sand-50 dark:bg-gray-900 pb-20">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-xl font-cal text-chapa-purple-600 dark:text-chapa-purple-300 mb-1">
          Community Contributions
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-poppins">
          Share your legal expertise with African businesses
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="chapa-glass-card p-4 text-center">
          <div class="text-2xl font-bold text-chapa-purple-600 font-cal">{{ stats.templates }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Templates</div>
        </div>
        <div class="chapa-glass-card p-4 text-center">
          <div class="text-2xl font-bold text-chapa-orange-500 font-cal">{{ stats.contributors }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Contributors</div>
        </div>
        <div class="chapa-glass-card p-4 text-center">
          <div class="text-2xl font-bold text-chapa-sand-500 font-cal">{{ stats.downloads }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Downloads</div>
        </div>
      </div>

      <!-- Contribution Info -->
      <div class="chapa-glass-card p-5 mb-6">
        <div class="flex items-start space-x-3">
          <Icon icon="material-symbols:group" class="text-2xl text-chapa-purple-500 mt-1" />
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 font-poppins">
              Join Our Legal Community
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Contribute contract templates and help African SMEs access quality legal documents. 
              Get recognition and build your professional reputation.
            </p>
            <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
                <span>Professional credit and attribution</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
                <span>Client acquisition opportunities</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check-circle" class="text-green-500 text-lg" />
                <span>Build authority in your field</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Contribution Form -->
      <div class="chapa-glass-card p-5 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
          Submit a Template
        </h3>
        
        <form @submit.prevent="submitTemplate" class="space-y-4">
          <!-- Template Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
              Template Title *
            </label>
            <input 
              v-model="templateForm.title"
              type="text" 
              required
              placeholder="e.g., Nigeria Import Agreement"
              class="input-modern w-full"
            >
          </div>

          <!-- Template Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
              Contract Type *
            </label>
            <select 
              v-model="templateForm.type"
              required
              class="input-modern w-full"
            >
              <option value="">Select type</option>
              <option value="debt">Debt Agreement</option>
              <option value="sales">Sales Agreement</option>
              <option value="service">Service Contract</option>
              <option value="partnership">Partnership Agreement</option>
              <option value="import-export">Import/Export Terms</option>
              <option value="employment">Employment Contract</option>
              <option value="nda">Confidentiality (NDA)</option>
              <option value="custom">Other</option>
            </select>
          </div>

          <!-- Jurisdiction -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
              Jurisdiction *
            </label>
            <select 
              v-model="templateForm.jurisdiction"
              required
              class="input-modern w-full"
            >
              <option value="">Select country</option>
              <option 
                v-for="country in allCountries" 
                :key="country.code"
                :value="country.code"
              >
                {{ country.name }}
              </option>
            </select>
          </div>

          <!-- Template Content -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
              Template Content *
            </label>
            <textarea 
              v-model="templateForm.content"
              required
              rows="8"
              placeholder="Paste your contract template here. Use [Placeholders] for dynamic fields."
              class="input-modern w-full resize-none"
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Use [Field Name] for placeholders that users will fill in
            </p>
          </div>

          <!-- Contributor Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                Your Name *
              </label>
              <input 
                v-model="templateForm.contributor.name"
                type="text" 
                required
                placeholder="Full name"
                class="input-modern w-full"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                Your Firm (Optional)
              </label>
              <input 
                v-model="templateForm.contributor.firm"
                type="text" 
                placeholder="Law firm or company"
                class="input-modern w-full"
              >
            </div>
          </div>

          <!-- Contact Info -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
              Contact Email *
            </label>
            <input 
              v-model="templateForm.contributor.email"
              type="email" 
              required
              placeholder="email@example.com"
              class="input-modern w-full"
            >
          </div>

          <!-- License Agreement -->
          <div class="flex items-start space-x-3">
            <input 
              v-model="templateForm.agreement"
              type="checkbox" 
              required
              class="mt-1 rounded border-gray-300 text-chapa-purple-500 focus:ring-chapa-purple-500"
            >
            <label class="text-sm text-gray-600 dark:text-gray-300">
              I agree to share this template under the 
              <a href="#" class="text-chapa-purple-500 hover:underline">ChapaDocs Contribution License</a>. 
              I confirm that I have the right to share this content.
            </label>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            :disabled="!canSubmit"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Template
          </button>
        </form>
      </div>

      <!-- Recent Contributions -->
      <div class="chapa-glass-card p-5">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
          Recent Contributions
        </h3>
        <div class="space-y-3">
          <div 
            v-for="contribution in recentContributions"
            :key="contribution.id"
            class="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-700/50"
          >
            <div>
              <h4 class="font-medium text-gray-800 dark:text-white font-poppins text-sm">
                {{ contribution.title }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                By {{ contribution.contributor.name }} · {{ contribution.jurisdiction }}
              </p>
            </div>
            <span class="text-xs text-gray-400">{{ contribution.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

// Stats
const stats = ref({
  templates: 47,
  contributors: 23,
  downloads: 1250
})

// Template Form
const templateForm = ref({
  title: '',
  type: '',
  jurisdiction: '',
  content: '',
  contributor: {
    name: '',
    firm: '',
    email: ''
  },
  agreement: false
})

// Countries list (same as in contract builder)
const allCountries = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },
  { code: 'TD', name: 'Chad' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'RU', name: 'Russia' }
  // ... all other countries
]

// Recent contributions (would come from API in real app)
const recentContributions = ref([
  {
    id: 1,
    title: 'Nigeria Debt Recovery Agreement',
    contributor: { name: 'ABC Law Partners' },
    jurisdiction: 'Nigeria',
    date: '2 days ago'
  },
  {
    id: 2,
    title: 'Kenya Sales Contract Template',
    contributor: { name: 'John Mwangi' },
    jurisdiction: 'Kenya',
    date: '1 week ago'
  },
  {
    id: 3,
    title: 'China-Africa Import Terms',
    contributor: { name: 'Legal Experts Ltd' },
    jurisdiction: 'China',
    date: '2 weeks ago'
  }
])

// Computed
const canSubmit = computed(() => {
  return templateForm.value.title &&
         templateForm.value.type &&
         templateForm.value.jurisdiction &&
         templateForm.value.content &&
         templateForm.value.contributor.name &&
         templateForm.value.contributor.email &&
         templateForm.value.agreement
})

// Methods
const submitTemplate = async () => {
  try {
    // In production, this would send to your backend
    // For now, we'll save to localStorage
    const contributions = JSON.parse(localStorage.getItem('chapaContributions') || '[]')
    
    const newContribution = {
      id: Date.now().toString(),
      ...templateForm.value,
      date: new Date().toISOString(),
      status: 'pending'
    }
    
    contributions.unshift(newContribution)
    localStorage.setItem('chapaContributions', JSON.stringify(contributions))
    
    // Reset form
    templateForm.value = {
      title: '',
      type: '',
      jurisdiction: '',
      content: '',
      contributor: {
        name: '',
        firm: '',
        email: ''
      },
      agreement: false
    }
    
    alert('Thank you for your contribution! We will review it and add it to the template library soon.')
    
  } catch (error) {
    alert('Failed to submit template. Please try again.')
  }
}
</script>