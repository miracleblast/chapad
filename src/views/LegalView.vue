<template>
  <div class="min-h-screen bg-chapa-sand-50 dark:bg-gray-900 pb-20">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center space-x-3">
          <button @click="goBack" class="btn-ghost p-2">
            <Icon icon="material-symbols:arrow-back" class="text-xl" />
          </button>
          <div>
            <h1 class="text-xl font-cal text-chapa-purple-600 dark:text-chapa-purple-300 mb-1">
              Legal Information
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-poppins">
              Terms, Privacy & Disclaimers
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Legal Tabs -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4">
        <div class="flex space-x-4 overflow-x-auto py-3">
          <button
            v-for="tab in legalTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
            :class="activeTab === tab.id
              ? 'bg-chapa-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Legal Content -->
    <div class="container mx-auto px-4 py-6">
      <div class="chapa-glass-card p-6">
        <!-- Privacy Policy -->
        <div v-if="activeTab === 'privacy'" class="prose prose-sm dark:prose-invert max-w-none">
          <h2>Privacy Policy</h2>
          <p><strong>Last updated:</strong> {{ currentDate }}</p>

          <h3>1. Data Collection</h3>
          <p>ChapaDocs is designed with privacy as a core principle:</p>
          <ul>
            <li><strong>No Personal Data Collection:</strong> We do not collect, store, or process any personal information on our servers</li>
            <li><strong>Local Storage Only:</strong> All your contracts, templates, and signatures are stored locally on your device</li>
            <li><strong>No Tracking:</strong> We do not use cookies, analytics, or any tracking technologies</li>
            <li><strong>No Account Required:</strong> Use the app immediately without creating an account</li>
          </ul>

          <h3>2. Data Storage</h3>
          <p>Your data remains on your device using modern browser storage technologies:</p>
          <ul>
            <li><strong>IndexedDB:</strong> Contracts and templates are stored in your browser's local database</li>
            <li><strong>LocalStorage:</strong> App settings and preferences</li>
            <li><strong>Complete Control:</strong> You can export or delete your data at any time through the Settings page</li>
          </ul>

          <h3>3. Third-Party Services</h3>
          <p>We use minimal third-party services:</p>
          <ul>
            <li><strong>Iconify:</strong> For UI icons (loaded via CDN)</li>
            <li><strong>Google Fonts:</strong> For typography (Poppins, Cal Sans, Montserrat)</li>
            <li>No other external services or APIs are used</li>
          </ul>

          <h3>4. Your Rights</h3>
          <p>You have complete control over your data:</p>
          <ul>
            <li>Export all your data in JSON format</li>
            <li>Delete all local data instantly</li>
            <li>Use the app completely offline</li>
            <li>No data retention - when you delete, it's gone forever</li>
          </ul>

          <h3>5. Contact</h3>
          <p>For privacy-related questions, contact us via:</p>
          <ul>
            <li>Telegram: @harambeetech</li>
            <li>Email: privacy@chapadocs.o</li>
          </ul>
        </div>

        <!-- Terms of Service -->
        <div v-else-if="activeTab === 'tos'" class="prose prose-sm dark:prose-invert max-w-none">
          <h2>Terms of Service</h2>
          <p><strong>Last updated:</strong> {{ currentDate }}</p>

          <h3>1. Acceptance of Terms</h3>
          <p>By using ChapaDocs, you agree to these Terms of Service. If you disagree with any part, you may not use our services.</p>

          <h3>2. Description of Service</h3>
          <p>ChapaDocs provides:</p>
          <ul>
            <li>Contract template creation and management</li>
            <li>Digital signature capabilities</li>
            <li>Document storage and export</li>
            <li>All features work entirely locally on your device</li>
          </ul>

          <h3>3. User Responsibilities</h3>
          <p>You agree to:</p>
          <ul>
            <li>Use the service only for lawful purposes</li>
            <li>Not create contracts that violate any laws or regulations</li>
            <li>Ensure you have proper authority to sign contracts</li>
            <li>Keep your device secure to protect your data</li>
          </ul>

          <h3>4. Intellectual Property</h3>
          <p><strong>Your Content:</strong> You retain all rights to the contracts and documents you create.</p>
          <p><strong>Our Software:</strong> ChapaDocs software is proprietary and licensed for use under these terms.</p>

          <h3>5. Subscription Terms</h3>
          <p><strong>Free Tier:</strong> Basic features with ChapaDocs branding</p>
          <p><strong>Pro Tier:</strong> Enhanced features and reduced branding</p>
          <p><strong>Business Tier:</strong> Advanced features and custom branding</p>
          <p><strong>Corporate Tier:</strong> White-label solution</p>
          <p>All subscriptions auto-renew and can be canceled anytime.</p>

          <h3>6. Termination</h3>
          <p>We may terminate or suspend access immediately if you violate these Terms.</p>

          <h3>7. Changes to Terms</h3>
          <p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance.</p>
        </div>

        <!-- Legal Disclaimer -->
        <div v-else-if="activeTab === 'disclaimer'" class="prose prose-sm dark:prose-invert max-w-none">
          <h2>Legal Disclaimer</h2>
          <p><strong>Last updated:</strong> {{ currentDate }}</p>

          <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
            <div class="flex items-start space-x-3">
              <Icon icon="material-symbols:warning" class="text-orange-500 text-xl mt-1 flex-shrink-0" />
              <div>
                <h4 class="font-semibold text-orange-800 dark:text-orange-300 mb-2">Important Legal Notice</h4>
                <p class="text-orange-700 dark:text-orange-400 text-sm">
                  ChapaDocs is a document generation tool, not a law firm. We do not provide legal advice.
                </p>
              </div>
            </div>
          </div>

          <h3>1. No Attorney-Client Relationship</h3>
          <p>Using ChapaDocs does not create an attorney-client relationship. We are a technology platform, not a law firm.</p>

          <h3>2. Not Legal Advice</h3>
          <p>The templates and tools provided are:</p>
          <ul>
            <li><strong>General in nature</strong> and may not suit your specific situation</li>
            <li><strong>Not a substitute</strong> for professional legal advice</li>
            <li><strong>Not guaranteed</strong> to be legally enforceable in your jurisdiction</li>
          </ul>

          <h3>3. User Responsibility</h3>
          <p>You are solely responsible for:</p>
          <ul>
            <li>Reviewing all contracts with a qualified legal professional</li>
            <li>Ensuring contracts comply with local laws and regulations</li>
            <li>Verifying all information in contracts is accurate</li>
            <li>Understanding the legal implications before signing</li>
          </ul>

          <h3>4. Jurisdictional Limitations</h3>
          <p>Laws vary by country and region. Templates may not be suitable for:</p>
          <ul>
            <li>All African jurisdictions</li>
            <li>Specific industry regulations</li>
            <li>Complex legal situations</li>
          </ul>

          <h3>5. No Warranty</h3>
          <p>ChapaDocs is provided "as is" without warranties of any kind. We do not guarantee:</p>
          <ul>
            <li>Legal validity of generated documents</li>
            <li>Compliance with specific laws</li>
            <li>Fitness for any particular purpose</li>
          </ul>

          <h3>6. Limitation of Liability</h3>
          <p>To the fullest extent permitted by law, ChapaDocs shall not be liable for any damages resulting from:</p>
          <ul>
            <li>Use or inability to use the service</li>
            <li>Legal disputes arising from generated contracts</li>
            <li>Financial losses related to contract enforcement</li>
          </ul>

          <h3>7. Professional Consultation</h3>
          <p>We strongly recommend consulting with a qualified legal professional:</p>
          <ul>
            <li>Before using any contract template</li>
            <li>For important business agreements</li>
            <li>When dealing with complex legal matters</li>
            <li>If you are unsure about any legal requirements</li>
          </ul>
        </div>

        <!-- Contribution Guidelines -->
        <div v-else-if="activeTab === 'contributions'" class="prose prose-sm dark:prose-invert max-w-none">
          <h2>Contribution Guidelines</h2>
          <p><strong>Last updated:</strong> {{ currentDate }}</p>

          <h3>1. Contribution License</h3>
          <p>By contributing templates to ChapaDocs, you grant us a worldwide, non-exclusive, royalty-free license to:</p>
          <ul>
            <li>Distribute your templates to ChapaDocs users</li>
            <li>Modify templates for formatting and compatibility</li>
            <li>Display your attribution as provided</li>
          </ul>

          <h3>2. Contributor Requirements</h3>
          <p>You must have the right to contribute content that:</p>
          <ul>
            <li>You created yourself</li>
            <li>Is not subject to third-party copyright</li>
            <li>Does not contain confidential information</li>
            <li>Complies with applicable laws</li>
          </ul>

          <h3>3. Attribution</h3>
          <p>We will credit contributors as follows:</p>
          <ul>
            <li>Display contributor name and/or firm name</li>
            <li>Optional contact information if provided</li>
            <li>Prominent placement in template details</li>
          </ul>

          <h3>4. Quality Standards</h3>
          <p>Contributions should:</p>
          <ul>
            <li>Be professionally drafted and accurate</li>
            <li>Follow standard legal formatting</li>
            <li>Include clear placeholders for dynamic content</li>
            <li>Be specific to the chosen jurisdiction</li>
          </ul>

          <h3>5. Review Process</h3>
          <p>All contributions are reviewed before publication for:</p>
          <ul>
            <li>Legal appropriateness</li>
            <li>Formatting consistency</li>
            <li>Quality standards</li>
            <li>Compliance with these guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()

// State
const activeTab = ref('privacy')

// Legal tabs
const legalTabs = [
  { id: 'privacy', name: 'Privacy Policy' },
  { id: 'tos', name: 'Terms of Service' },
  { id: 'disclaimer', name: 'Legal Disclaimer' },
  { id: 'contributions', name: 'Contributions' }
]

// Computed
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Methods
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.prose {
  max-width: none;
  line-height: 1.6;
}

.prose h2 {
  @apply text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-6 font-poppins;
}

.prose h3 {
  @apply text-lg font-semibold text-gray-800 dark:text-white mb-3 mt-4 font-poppins;
}

.prose p {
  @apply text-gray-600 dark:text-gray-300 mb-4 font-poppins;
}

.prose ul {
  @apply text-gray-600 dark:text-gray-300 mb-4 space-y-2 font-poppins;
}

.prose li {
  @apply ml-4;
}
</style>