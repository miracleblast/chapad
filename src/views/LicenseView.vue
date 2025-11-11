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
              License Management
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-poppins">
              Activate and manage your subscription
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <!-- Current License Status -->
      <div class="chapa-glass-card p-5 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
          Current License
        </h3>

        <div v-if="currentLicense" class="space-y-4">
          <!-- Active License -->
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <Icon icon="material-symbols:check-circle" class="text-green-500 text-xl" />
                <span class="font-semibold text-green-700 dark:text-green-300">License Active</span>
              </div>
              <span class="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                {{ currentLicense.plan }}
              </span>
            </div>
            <div class="text-sm text-green-600 dark:text-green-400 space-y-1">
              <p>Activated: {{ formatDate(currentLicense.activatedAt) }}</p>
              <p>Expires: {{ formatDate(currentLicense.expiresAt) }}</p>
              <p v-if="currentLicense.autoRenew" class="flex items-center space-x-1">
                <Icon icon="material-symbols:autorenew" class="text-sm" />
                <span>Auto-renew enabled</span>
              </p>
            </div>
          </div>

          <!-- License Features -->
          <div class="space-y-2">
            <h4 class="font-medium text-gray-700 dark:text-gray-300 text-sm">Plan Features:</h4>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li v-for="feature in currentLicense.features" :key="feature" class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- License Actions -->
          <div class="flex space-x-2 pt-2">
            <button @click="manageSubscription" class="btn-secondary flex-1">
              Manage Subscription
            </button>
            <button @click="deactivateLicense" class="btn-secondary flex-1 text-red-500 hover:text-red-600">
              Deactivate
            </button>
          </div>
        </div>

        <!-- No License -->
        <div v-else class="text-center py-6">
          <Icon icon="material-symbols:lock-outline" class="text-4xl text-chapa-orange-500 mb-3 mx-auto" />
          <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">No Active License</h4>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-4">
            Activate a license to access premium features
          </p>
          <button @click="showActivationModal = true" class="btn-primary">
            Activate License
          </button>
        </div>
      </div>

      <!-- Available Plans -->
      <div class="chapa-glass-card p-5 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
          Available Plans
        </h3>

        <div class="grid gap-4">
          <!-- Pro Plan -->
          <div class="border-2 border-chapa-purple-200 dark:border-chapa-purple-800 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-gray-800 dark:text-white">Pro Plan</h4>
              <div class="text-right">
                <div class="text-xl font-bold text-chapa-purple-600">$5<span class="text-sm text-gray-500">/month</span></div>
              </div>
            </div>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-4">
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>500 contracts per month</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>3 team members</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>All African + BRICS currencies</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>Reduced branding</span>
              </li>
            </ul>
            <button @click="selectPlan('pro')" class="w-full btn-primary">
              Select Pro Plan
            </button>
          </div>

          <!-- Business Plan -->
          <div class="border-2 border-chapa-purple-300 dark:border-chapa-purple-700 rounded-xl p-4 bg-gradient-to-r from-chapa-purple-50 to-purple-100 dark:from-chapa-purple-900/20 dark:to-purple-900/10">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-gray-800 dark:text-white">Business Plan</h4>
              <div class="text-right">
                <div class="text-xl font-bold text-chapa-purple-600">$15<span class="text-sm text-gray-500">/month</span></div>
              </div>
            </div>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-4">
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>Unlimited contracts</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>15 team members</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>Custom branding</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>Priority support</span>
              </li>
            </ul>
            <button @click="selectPlan('business')" class="w-full btn-primary">
              Select Business Plan
            </button>
          </div>

          <!-- Corporate Plan -->
          <div class="border-2 border-chapa-orange-200 dark:border-chapa-orange-800 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-gray-800 dark:text-white">Corporate Plan</h4>
              <div class="text-right">
                <div class="text-xl font-bold text-chapa-orange-500">$50<span class="text-sm text-gray-500">/month</span></div>
              </div>
            </div>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-4">
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>500 team members</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>White-label solution</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>API access</span>
              </li>
              <li class="flex items-center space-x-2">
                <Icon icon="material-symbols:check" class="text-green-500 text-sm" />
                <span>Dedicated support</span>
              </li>
            </ul>
            <button @click="selectPlan('corporate')" class="w-full btn-accent">
              Select Corporate Plan
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="chapa-glass-card p-5">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
          Payment Methods
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-700/50">
            <div class="flex items-center space-x-3">
              <Icon icon="cryptocurrency:btc" class="text-orange-500 text-xl" />
              <span class="font-medium text-gray-700 dark:text-gray-300">Bitcoin (BTC)</span>
            </div>
            <Icon icon="material-symbols:check-circle" class="text-green-500" />
          </div>
          <div class="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-700/50">
            <div class="flex items-center space-x-3">
              <Icon icon="cryptocurrency:eth" class="text-gray-600 text-xl" />
              <span class="font-medium text-gray-700 dark:text-gray-300">Ethereum (ETH)</span>
            </div>
            <Icon icon="material-symbols:check-circle" class="text-green-500" />
          </div>
          <div class="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-700/50">
            <div class="flex items-center space-x-3">
              <Icon icon="cryptocurrency:usdt" class="text-green-500 text-xl" />
              <span class="font-medium text-gray-700 dark:text-gray-300">USDT (Stablecoin)</span>
            </div>
            <Icon icon="material-symbols:check-circle" class="text-green-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- License Activation Modal -->
    <div v-if="showActivationModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="chapa-glass-card p-6 max-w-md w-full">
        <h3 class="text-xl font-cal text-chapa-purple-600 mb-4">
          {{ selectedPlan ? `Activate ${selectedPlan.name} Plan` : 'Activate License' }}
        </h3>
        
        <div class="space-y-4">
          <!-- License Key Input -->
          <div v-if="!selectedPlan">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
              License Key
            </label>
            <input 
              v-model="licenseKey"
              type="text" 
              placeholder="Enter your license key"
              class="input-modern w-full"
            >
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Don't have a key? 
              <a href="#" class="text-chapa-purple-500 hover:underline">Purchase one</a>
            </p>
          </div>

          <!-- Plan Selection Confirmation -->
          <div v-else class="bg-chapa-purple-50 dark:bg-chapa-purple-900/20 rounded-lg p-4">
            <h4 class="font-semibold text-chapa-purple-700 dark:text-chapa-purple-300 mb-2">
              {{ selectedPlan.name }}
            </h4>
            <p class="text-sm text-chapa-purple-600 dark:text-chapa-purple-400">
              {{ selectedPlan.price }}/month · Auto-renewal
            </p>
          </div>

          <!-- Payment Instructions -->
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <Icon icon="material-symbols:info" class="text-yellow-500 text-xl mt-1 flex-shrink-0" />
              <div class="text-sm text-yellow-700 dark:text-yellow-400">
                <p class="font-medium mb-1">Crypto Payment Required</p>
                <p>After confirmation, you'll receive payment instructions via your preferred cryptocurrency.</p>
              </div>
            </div>
          </div>

          <div class="flex space-x-2">
            <button @click="activateLicense" class="btn-primary flex-1">
              {{ selectedPlan ? 'Continue to Payment' : 'Activate' }}
            </button>
            <button @click="showActivationModal = false" class="btn-secondary flex-1">
              Cancel
            </button>
          </div>
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
const currentLicense = ref<any>(null) // Would come from your license system
const showActivationModal = ref(false)
const licenseKey = ref('')
const selectedPlan = ref<any>(null)

// Available plans
const plans = {
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    price: '$5',
    features: [
      '500 contracts per month',
      '3 team members',
      'All currencies supported',
      'Reduced branding',
      'Basic support'
    ]
  },
  business: {
    id: 'business',
    name: 'Business Plan', 
    price: '$15',
    features: [
      'Unlimited contracts',
      '15 team members',
      'Custom branding',
      'Priority support',
      'Advanced templates'
    ]
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate Plan',
    price: '$50', 
    features: [
      '500 team members',
      'White-label solution',
      'API access',
      'Dedicated support',
      'Custom development'
    ]
  }
}

// Computed
const hasActiveLicense = computed(() => {
  return currentLicense.value !== null
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const selectPlan = (planId: string) => {
  selectedPlan.value = plans[planId as keyof typeof plans]
  showActivationModal.value = true
}

const activateLicense = async () => {
  try {
    if (selectedPlan.value) {
      // For plan selection, redirect to payment
      // In production, this would integrate with your crypto payment system
      alert(`Redirecting to payment for ${selectedPlan.value.name}...`)
      
      // Simulate successful activation
      currentLicense.value = {
        plan: selectedPlan.value.name,
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        autoRenew: true,
        features: selectedPlan.value.features
      }
      
    } else if (licenseKey.value.trim()) {
      // For license key activation
      // In production, this would validate with your backend
      currentLicense.value = {
        plan: 'Pro Plan', // Default assumption
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: false,
        features: plans.pro.features
      }
    }
    
    showActivationModal.value = false
    licenseKey.value = ''
    selectedPlan.value = null
    
    alert('License activated successfully!')
    
  } catch (error) {
    alert('Failed to activate license. Please try again.')
  }
}

const manageSubscription = () => {
  // In production, this would open subscription management
  alert('Subscription management coming soon!')
}

const deactivateLicense = () => {
  if (confirm('Are you sure you want to deactivate your license?')) {
    currentLicense.value = null
    alert('License deactivated successfully!')
  }
}

const goBack = () => {
  router.back()
}

// Check for existing license on mount
// In production, this would check localStorage or your backend
const savedLicense = localStorage.getItem('chapaLicense')
if (savedLicense) {
  currentLicense.value = JSON.parse(savedLicense)
}
</script>