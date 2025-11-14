<template>
  <div class="contract-preview">
    <div class="chapa-glass-card p-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins border-b pb-2">
        Contract Preview
        <span class="text-sm text-gray-500 font-normal">(Live Preview)</span>
      </h3>
      
      <div class="preview-content bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
        <!-- Contract Header -->
        <div class="text-center mb-6 border-b pb-4">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white font-cal">
            {{ contractData.title || 'Contract Title' }}
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ getContractTypeName(contractData.type) }}
          </p>
        </div>

        <!-- Parties Information -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Parties</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border rounded-lg p-3">
              <h3 class="font-medium text-gray-700 dark:text-gray-300">First Party</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ contractData.parties?.firstParty?.name || '[Your Company/Name]' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {{ getCountryName(contractData.jurisdiction?.firstCountry) || '[Your Country]' }}
              </p>
            </div>
            <div class="border rounded-lg p-3">
              <h3 class="font-medium text-gray-700 dark:text-gray-300">Second Party</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ contractData.parties?.secondParty?.name || '[Other Party]' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {{ getCountryName(contractData.jurisdiction?.secondCountry) || '[Their Country]' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Template Data Preview -->
        <div v-if="Object.keys(templateData).length > 0" class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Contract Details</h2>
          <div class="space-y-2 text-sm">
            <div v-for="(value, key) in templateData" :key="key" class="flex justify-between border-b pb-1">
              <span class="text-gray-600 dark:text-gray-400 capitalize">{{ key.replace(/([A-Z])/g, ' $1').trim() }}:</span>
              <span class="text-gray-800 dark:text-white font-medium">{{ value || '[Not Set]' }}</span>
            </div>
          </div>
        </div>

        <!-- Terms Preview -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Terms & Conditions</h2>
          <div class="prose prose-sm dark:prose-invert max-w-none">
            <pre class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded border">
{{ contractData.terms || 'Enter contract terms and conditions...' }}
            </pre>
          </div>
        </div>

        <!-- Footer with ChapaDocs branding -->
        <div class="border-t pt-4 mt-6 text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Generated using ChapaDocs by Harambee
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Contract ID: {{ contractData.id || 'DRAFT' }} | Created: {{ new Date().toLocaleDateString() }}
          </p>
        </div>

        <!-- Signature Areas -->
        <div class="grid grid-cols-2 gap-6 mt-6 border-t pt-4">
          <div class="text-center">
            <div class="h-16 border-b border-gray-300 dark:border-gray-600 mb-2"></div>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              {{ contractData.parties?.firstParty?.name || 'First Party' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500">Signature</p>
          </div>
          <div class="text-center">
            <div class="h-16 border-b border-gray-300 dark:border-gray-600 mb-2"></div>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              {{ contractData.parties?.secondParty?.name || 'Second Party' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500">Signature</p>
          </div>
        </div>
      </div>

      <!-- Preview Actions -->
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Changes update in real-time
        </div>
        <button 
          @click="copyToClipboard"
          class="btn-secondary text-xs px-3 py-1"
        >
          Copy Text
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  contractData: any
  templateData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  contractData: () => ({}),
  templateData: () => ({})
})

// Helper methods
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
  font-family: 'Times New Roman', Times, serif;
  line-height: 1.6;
}

.preview-content h1, .preview-content h2, .preview-content h3 {
  color: #1f2937;
}

.dark .preview-content h1, 
.dark .preview-content h2, 
.dark .preview-content h3 {
  color: #f9fafb;
}
</style>