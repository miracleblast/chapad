<template>
  <div class="min-h-screen p-4 bg-chapa-sand-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="text-center mb-6">
      <div class="bird-nod mb-3">
        <Icon icon="noto:bird" class="text-5xl text-chapa-purple-600" />
      </div>
      <h1 class="text-2xl font-cal text-gradient-purple mb-2">Choose Contract Type</h1>
      <p class="text-gray-600 dark:text-gray-300 font-poppins text-sm">
        Select your contract type to get started
      </p>
    </div>

    <!-- Contract Type Grid -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <!-- Debt Agreement - TOP PRIORITY -->
      <button 
        @click="selectContractType('debt')"
        class="chapa-glass-card p-4 text-center card-hover border-2 border-chapa-orange-200 dark:border-chapa-orange-800"
      >
        <div class="flex justify-center mb-2">
          <Icon icon="material-symbols:money" class="text-2xl text-chapa-orange-500" />
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm mb-1">
          Debt Agreement
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-tight">
          Money lending with repayment terms
        </p>
        <div class="mt-2">
          <span class="inline-block bg-chapa-orange-100 dark:bg-chapa-orange-900 text-chapa-orange-700 dark:text-chapa-orange-300 text-xs px-2 py-1 rounded-full">
            Most Used
          </span>
        </div>
      </button>

      <!-- Sales Agreement -->
      <button 
        @click="selectContractType('sales')"
        class="chapa-glass-card p-4 text-center card-hover"
      >
        <div class="flex justify-center mb-2">
          <Icon icon="material-symbols:shopping-cart" class="text-2xl text-chapa-purple-500" />
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm mb-1">
          Sales Agreement
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-tight">
          Goods and services sales
        </p>
      </button>

      <!-- Service Contract -->
      <button 
        @click="selectContractType('service')"
        class="chapa-glass-card p-4 text-center card-hover"
      >
        <div class="flex justify-center mb-2">
          <Icon icon="material-symbols:design-services" class="text-2xl text-chapa-purple-500" />
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm mb-1">
          Service Contract
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-tight">
          Professional services agreement
        </p>
      </button>

      <!-- Partnership Agreement -->
      <button 
        @click="selectContractType('partnership')"
        class="chapa-glass-card p-4 text-center card-hover"
      >
        <div class="flex justify-center mb-2">
          <Icon icon="material-symbols:handshake" class="text-2xl text-chapa-purple-500" />
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm mb-1">
          Partnership
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-tight">
          Business partnership terms
        </p>
      </button>

      <!-- Import/Export Terms -->
      <button 
        @click="selectContractType('import-export')"
        class="chapa-glass-card p-4 text-center card-hover"
      >
        <div class="flex justify-center mb-2">
          <Icon icon="material-symbols:airport-shuttle" class="text-2xl text-chapa-purple-500" />
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm mb-1">
          Import/Export
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-tight">
          Cross-border trade agreement
        </p>
      </button>

      <!-- Employment Contract -->
      <button 
        @click="selectContractType('employment')"
        class="chapa-glass-card p-4 text-center card-hover"
      >
        <div class="flex justify-center mb-2">
          <Icon icon="material-symbols:work" class="text-2xl text-chapa-purple-500" />
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm mb-1">
          Employment
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-tight">
          Employee work agreement
        </p>
      </button>

      <!-- NDA -->
      <button 
        @click="selectContractType('nda')"
        class="chapa-glass-card p-4 text-center card-hover"
      >
        <div class="flex justify-center mb-2">
          <Icon icon="material-symbols:lock" class="text-2xl text-chapa-purple-500" />
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm mb-1">
          Confidentiality
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-tight">
          Non-disclosure agreement
        </p>
      </button>

      <!-- Custom Contract -->
      <button 
        @click="selectContractType('custom')"
        class="chapa-glass-card p-4 text-center card-hover border-2 border-dashed border-gray-300 dark:border-gray-600"
      >
        <div class="flex justify-center mb-2">
          <Icon icon="material-symbols:edit-document" class="text-2xl text-gray-400" />
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white font-poppins text-sm mb-1">
          Custom Contract
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-tight">
          Build from scratch
        </p>
      </button>
    </div>

    <!-- Quick Stats - Now visible above buttons -->
    <div class="chapa-glass-card p-4 mb-24"> <!-- Increased bottom margin to account for buttons -->
      <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
        Popular in Your Region
      </h3>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-600 dark:text-gray-300">Debt Agreements</span>
          <span class="text-xs font-semibold text-chapa-orange-500">87%</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-600 dark:text-gray-300">Sales Contracts</span>
          <span class="text-xs font-semibold text-chapa-purple-500">65%</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-600 dark:text-gray-300">Service Agreements</span>
          <span class="text-xs font-semibold text-chapa-purple-500">58%</span>
        </div>
      </div>
    </div>

    <!-- Bottom Action - COMPACT & RESPONSIVE -->
    <!-- Alternative: Sticky buttons (remove the fixed div and replace with this) -->
<div class="sticky bottom-4 mt-8 space-y-2 z-30">
  <button 
    @click="createFromScratch"
    class="w-full btn-primary flex items-center justify-center space-x-2 py-2 text-sm"
  >
    <Icon icon="material-symbols:edit-document" class="text-base" />
    <span class="font-poppins font-medium">Create Empty Contract</span>
  </button>
  
  <button 
    @click="browseAllTemplates"
    class="w-full btn-secondary flex items-center justify-center space-x-2 py-2 text-sm"
  >
    <Icon icon="material-symbols:library-books" class="text-base" />
    <span class="font-poppins font-medium">Browse All Templates</span>
  </button>
</div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Contract types data
const contractTypes = [
  {
    id: 'debt',
    name: 'Debt Agreement',
    icon: 'material-symbols:money',
    description: 'Money lending with repayment terms',
    popular: true,
    color: 'orange'
  },
  {
    id: 'sales', 
    name: 'Sales Agreement',
    icon: 'material-symbols:shopping-cart',
    description: 'Goods and services sales',
    popular: true,
    color: 'purple'
  },
  {
    id: 'service',
    name: 'Service Contract',
    icon: 'material-symbols:design-services', 
    description: 'Professional services agreement',
    popular: true,
    color: 'purple'
  },
  {
    id: 'partnership',
    name: 'Partnership Agreement',
    icon: 'material-symbols:handshake',
    description: 'Business partnership terms', 
    color: 'purple'
  },
  {
    id: 'import-export',
    name: 'Import/Export Terms',
    icon: 'material-symbols:airport-shuttle',
    description: 'Cross-border trade agreement',
    color: 'purple'
  },
  {
    id: 'employment', 
    name: 'Employment Contract',
    icon: 'material-symbols:work',
    description: 'Employee work agreement',
    color: 'purple'
  },
  {
    id: 'nda',
    name: 'Confidentiality',
    icon: 'material-symbols:lock',
    description: 'Non-disclosure agreement',
    color: 'purple'
  },
  {
    id: 'custom',
    name: 'Custom Contract', 
    icon: 'material-symbols:edit-document',
    description: 'Build from scratch',
    color: 'gray'
  }
]

// When user selects a specific type
const selectContractType = (typeId: string) => {
  console.log('Selected contract type:', typeId)
  
  if (typeId === 'custom') {
    // If custom, go directly to builder with empty template
    router.push({
      path: '/builder',
      query: { 
        type: 'custom', 
        fromScratch: 'true' 
      }
    })
  } else {
    // For specific types, go to templates filtered by type
    router.push({
      path: '/templates',
      query: { type: typeId }
    })
  }
}

// Bottom button: Create from scratch - GO TO BUILDER WITH EMPTY TEMPLATE
const createFromScratch = () => {
  console.log('Creating empty contract from scratch')
  router.push({
    path: '/builder',
    query: { 
      fromScratch: 'true',
      type: 'custom'
    }
  })
}

// Bottom button: Browse all templates - GO TO TEMPLATES (NO FILTER)
const browseAllTemplates = () => {
  console.log('Browsing all templates')
  router.push('/templates') // No query params = show all templates
}
</script>

<style scoped>
/* Mobile-optimized touch targets */
.grid button {
  min-height: 100px;
}

/* Ensure proper spacing for mobile */
.grid {
  grid-template-columns: repeat(2, 1fr);
}

/* Mobile-first responsive design */
@media (max-width: 320px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* Make bottom buttons more compact on mobile */
@media (max-width: 768px) {
  .fixed {
    bottom: 2rem;
  }
  
  .fixed button {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    font-size: 0.875rem;
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .fixed {
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
  }
  
  .fixed button {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}
</style>