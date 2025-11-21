<template>
  <div class="contract-preview">
    <div class="chapa-glass-card p-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins border-b pb-2">
        Contract Preview
        <span class="text-sm text-gray-500 font-normal">(Live Preview)</span>
      </h3>
      
      <div class="preview-content bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto shadow-lg">
        <!-- ENHANCED: Stylish Contract Header -->
        <div class="contract-header bg-gradient-to-r from-chapa-purple-600 via-chapa-purple-500 to-chapa-orange-500 text-white p-6 rounded-t-xl text-center relative overflow-hidden">
          <!-- African Pattern Background -->
          <div class="absolute inset-0 opacity-10">
            <div class="african-pattern w-full h-full"></div>
          </div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-center mb-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Icon :icon="getContractIcon(contractData.type)" class="text-white text-xl" />
              </div>
              <h1 class="text-2xl font-bold font-cal mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                {{ contractData.title || 'Contract Title' }}
              </h1>
            </div>
            <p class="opacity-90 text-sm font-poppins">{{ getContractTypeName(contractData.type) }}</p>
            <div class="flex items-center justify-center space-x-4 mt-3 text-xs opacity-80">
              <span class="flex items-center space-x-1">
                <Icon icon="material-symbols:today" class="text-sm" />
                <span>{{ new Date().toLocaleDateString() }}</span>
              </span>
              <span class="flex items-center space-x-1">
                <Icon icon="material-symbols:fingerprint" class="text-sm" />
                <span>{{ contractData.id ? `ID: ${contractData.id.substring(0, 8)}...` : 'DRAFT' }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- ENHANCED: Stylish Parties Section -->
        <div class="parties-section p-6 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center space-x-2 mb-4">
            <Icon icon="material-symbols:groups" class="text-chapa-purple-500 text-xl" />
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white font-poppins">Contracting Parties</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Party Card -->
            <div class="party-card group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-chapa-purple-300">
              <div class="absolute -top-3 -left-3 w-6 h-6 bg-chapa-purple-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">1</span>
              </div>
              
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-chapa-purple-100 to-chapa-purple-200 dark:from-chapa-purple-900 dark:to-chapa-purple-800 rounded-full flex items-center justify-center shadow-md">
                  <Icon icon="material-symbols:person" class="text-chapa-purple-600 dark:text-chapa-purple-300 text-xl" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 dark:text-white text-sm">First Party</h3>
                  <p class="text-chapa-purple-600 dark:text-chapa-purple-400 text-xs">Your Company</p>
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center space-x-2 text-sm">
                  <Icon icon="material-symbols:badge" class="text-gray-400 text-sm" />
                  <span class="text-gray-700 dark:text-gray-300 font-medium">{{ contractData.parties?.firstParty?.name || '[Your Company/Name]' }}</span>
                </div>
                <div class="flex items-center space-x-2 text-xs">
                  <Icon icon="material-symbols:location-on" class="text-gray-400" />
                  <span class="text-gray-500 dark:text-gray-400">{{ getCountryName(contractData.jurisdiction?.firstCountry) || '[Your Country]' }}</span>
                </div>
              </div>
            </div>

            <!-- Second Party Card -->
            <div class="party-card group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-chapa-orange-300">
              <div class="absolute -top-3 -left-3 w-6 h-6 bg-chapa-orange-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">2</span>
              </div>
              
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-chapa-orange-100 to-chapa-orange-200 dark:from-chapa-orange-900 dark:to-chapa-orange-800 rounded-full flex items-center justify-center shadow-md">
                  <Icon icon="material-symbols:person" class="text-chapa-orange-600 dark:text-chapa-orange-300 text-xl" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 dark:text-white text-sm">Second Party</h3>
                  <p class="text-chapa-orange-600 dark:text-chapa-orange-400 text-xs">Counterparty</p>
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center space-x-2 text-sm">
                  <Icon icon="material-symbols:badge" class="text-gray-400 text-sm" />
                  <span class="text-gray-700 dark:text-gray-300 font-medium">{{ contractData.parties?.secondParty?.name || '[Other Party]' }}</span>
                </div>
                <div class="flex items-center space-x-2 text-xs">
                  <Icon icon="material-symbols:location-on" class="text-gray-400" />
                  <span class="text-gray-500 dark:text-gray-400">{{ getCountryName(contractData.jurisdiction?.secondCountry) || '[Their Country]' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ENHANCED: Contract Details with Icons -->
        <div v-if="Object.keys(templateData).length > 0" class="contract-details p-6 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center space-x-2 mb-4">
            <Icon icon="material-symbols:description" class="text-chapa-purple-500 text-xl" />
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white font-poppins">Contract Details</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="(value, key) in templateData" 
              :key="key"
              class="detail-item bg-gray-50 dark:bg-gray-900 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {{ key.replace(/([A-Z])/g, ' $1').trim() }}
                </span>
                <span class="text-sm font-semibold text-gray-800 dark:text-white">
                  {{ value || '[Not Set]' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ENHANCED: Terms & Conditions with Better Styling -->
        <div class="terms-section p-6 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center space-x-2 mb-4">
            <Icon icon="material-symbols:gavel" class="text-chapa-purple-500 text-xl" />
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white font-poppins">Terms & Conditions</h2>
          </div>
          
          <div class="prose prose-sm dark:prose-invert max-w-none">
            <div class="terms-content bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 max-h-48 overflow-y-auto">
              <pre class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
{{ contractData.terms || 'Enter contract terms and conditions...' }}
              </pre>
            </div>
          </div>
        </div>

        <!-- ENHANCED: Signature Areas with Better Design -->
        <div class="signatures-section p-6">
          <div class="flex items-center space-x-2 mb-4">
            <Icon icon="material-symbols:signature" class="text-chapa-purple-500 text-xl" />
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white font-poppins">Signatures</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="signature-area text-center group">
              <div class="h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-3 flex items-center justify-center transition-all duration-300 group-hover:border-chapa-purple-400 group-hover:bg-chapa-purple-50 dark:group-hover:bg-chapa-purple-900/20">
                <span class="text-gray-400 text-xs">Signature Line</span>
              </div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ contractData.parties?.firstParty?.name || 'First Party' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Authorized Signature</p>
              <div class="flex items-center justify-center space-x-1 mt-1">
                <Icon icon="material-symbols:calendar-today" class="text-gray-400 text-xs" />
                <span class="text-xs text-gray-400">Date: ___________</span>
              </div>
            </div>
            
            <div class="signature-area text-center group">
              <div class="h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-3 flex items-center justify-center transition-all duration-300 group-hover:border-chapa-orange-400 group-hover:bg-chapa-orange-50 dark:group-hover:bg-chapa-orange-900/20">
                <span class="text-gray-400 text-xs">Signature Line</span>
              </div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ contractData.parties?.secondParty?.name || 'Second Party' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Authorized Signature</p>
              <div class="flex items-center justify-center space-x-1 mt-1">
                <Icon icon="material-symbols:calendar-today" class="text-gray-400 text-xs" />
                <span class="text-xs text-gray-400">Date: ___________</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ENHANCED: Footer with Better Branding -->
        <div class="footer bg-gray-50 dark:bg-gray-900 p-4 rounded-b-xl border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-gradient-to-r from-chapa-purple-500 to-chapa-orange-500 rounded-full flex items-center justify-center">
                <Icon icon="noto:bird" class="text-white text-xs" />
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400 font-poppins">
                Generated with ChapaDocs by Harambee
              </span>
            </div>
            <div class="text-xs text-gray-400 dark:text-gray-500">
              {{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Actions -->
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
          <Icon icon="material-symbols:auto-awesome" class="text-chapa-purple-500" />
          <span>Changes update in real-time</span>
        </div>
        <button 
          @click="copyToClipboard"
          class="btn-secondary text-xs px-3 py-1 flex items-center space-x-1"
        >
          <Icon icon="material-symbols:content-copy" class="text-sm" />
          <span>Copy Text</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, watch } from 'vue'

interface Props {
  contractData: any
  templateData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  contractData: () => ({}),
  templateData: () => ({})
})

// ENHANCED: Add contract type icons
const getContractIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    debt: 'material-symbols:money',
    sales: 'material-symbols:shopping-cart',
    service: 'material-symbols:design-services',
    partnership: 'material-symbols:handshake',
    mining: 'material-symbols:minerals',
    commodity: 'material-symbols:warehouse',
    agriculture: 'material-symbols:agriculture',
    'import-export': 'material-symbols:airport-shuttle',
    employment: 'material-symbols:work',
    nda: 'material-symbols:lock',
    custom: 'material-symbols:description'
  }
  return icons[type] || 'material-symbols:description'
}

// Helper methods (keep your existing ones)
const getContractTypeName = (type: string) => {
  const typeNames: { [key: string]: string } = {
    debt: 'Debt Agreement',
    sales: 'Sales Agreement',
    service: 'Service Contract',
    partnership: 'Partnership Agreement',
    mining: 'Mining Agreement',
    commodity: 'Commodity Trading Agreement',
    agriculture: 'Agricultural Supply Agreement',
    'import-export': 'Import/Export Agreement',
    custom: 'Custom Contract'
  }
  return typeNames[type] || 'Contract'
}

const getCountryName = (countryCode: string) => {
  const allCountries = [
    // Africa
    { code: 'DZ', name: 'Algeria' }, { code: 'EG', name: 'Egypt' }, { code: 'LY', name: 'Libya' },
    { code: 'MA', name: 'Morocco' }, { code: 'MR', name: 'Mauritania' }, { code: 'TN', name: 'Tunisia' },
    { code: 'EH', name: 'Western Sahara' }, { code: 'BJ', name: 'Benin' }, { code: 'BF', name: 'Burkina Faso' },
    { code: 'CV', name: 'Cape Verde' }, { code: 'CI', name: 'Ivory Coast' }, { code: 'GM', name: 'Gambia' },
    { code: 'GH', name: 'Ghana' }, { code: 'GN', name: 'Guinea' }, { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'LR', name: 'Liberia' }, { code: 'ML', name: 'Mali' }, { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' }, { code: 'SN', name: 'Senegal' }, { code: 'SL', name: 'Sierra Leone' },
    { code: 'TG', name: 'Togo' }, { code: 'AO', name: 'Angola' }, { code: 'CM', name: 'Cameroon' },
    { code: 'CF', name: 'Central African Republic' }, { code: 'TD', name: 'Chad' }, { code: 'CG', name: 'Congo Republic' },
    { code: 'CD', name: 'DR Congo' }, { code: 'GQ', name: 'Equatorial Guinea' }, { code: 'GA', name: 'Gabon' },
    { code: 'ST', name: 'São Tomé and Príncipe' }, { code: 'BI', name: 'Burundi' }, { code: 'KM', name: 'Comoros' },
    { code: 'DJ', name: 'Djibouti' }, { code: 'ER', name: 'Eritrea' }, { code: 'ET', name: 'Ethiopia' },
    { code: 'KE', name: 'Kenya' }, { code: 'MG', name: 'Madagascar' }, { code: 'MW', name: 'Malawi' },
    { code: 'MU', name: 'Mauritius' }, { code: 'YT', name: 'Mayotte' }, { code: 'MZ', name: 'Mozambique' },
    { code: 'RW', name: 'Rwanda' }, { code: 'RE', name: 'Réunion' }, { code: 'SC', name: 'Seychelles' },
    { code: 'SO', name: 'Somalia' }, { code: 'SS', name: 'South Sudan' }, { code: 'SD', name: 'Sudan' },
    { code: 'TZ', name: 'Tanzania' }, { code: 'UG', name: 'Uganda' }, { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' }, { code: 'BW', name: 'Botswana' }, { code: 'LS', name: 'Lesotho' },
    { code: 'NA', name: 'Namibia' }, { code: 'ZA', name: 'South Africa' }, { code: 'SZ', name: 'Eswatini' },
    // Asia
    { code: 'CN', name: 'China' }, { code: 'HK', name: 'Hong Kong SAR' }, { code: 'IN', name: 'India' }, 
    { code: 'RU', name: 'Russia' }
  ]
  const country = allCountries.find(c => c.code === countryCode)
  return country?.name || countryCode
}

const copyToClipboard = async () => {
  const previewText = `
${props.contractData.title || 'Contract'}

PARTIES:
- First Party: ${props.contractData.parties?.firstParty?.name || '[Your Company]'} (${getCountryName(props.contractData.jurisdiction?.firstCountry) || '[Your Country]'})
- Second Party: ${props.contractData.parties?.secondParty?.name || '[Other Party]'} (${getCountryName(props.contractData.jurisdiction?.secondCountry) || '[Their Country]'})

CONTRACT DETAILS:
${Object.entries(props.templateData).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

TERMS:
${props.contractData.terms || '[Contract terms will appear here]'}

Generated using ChapaDocs by Harambee
  `.trim()

  try {
    await navigator.clipboard.writeText(previewText)
    alert('Contract text copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>

<style scoped>
.preview-content {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  line-height: 1.6;
}

/* African pattern background */
.african-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* Smooth transitions */
.party-card, .detail-item, .signature-area {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #7C3AED 0%, #EA580C 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Custom scrollbar for terms */
.terms-content::-webkit-scrollbar {
  width: 6px;
}

.terms-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.terms-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.terms-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .terms-content::-webkit-scrollbar-track {
  background: #374151;
}

.dark .terms-content::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .terms-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>