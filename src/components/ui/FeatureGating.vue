<template>
  <div>
    <slot v-if="isAllowed" />
    <div v-else class="feature-gated">
      <div class="chapa-glass-card p-6 text-center">
        <Icon :icon="featureIcon" class="text-4xl text-chapa-purple-500 mb-4" />
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          {{ featureName }} Required
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          {{ featureDescription }}
        </p>
        <button @click="upgradeLicense" class="btn-primary">
          Upgrade License
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useLicenseStore } from '@/stores/license'

interface Props {
  feature: 'contribution' | 'printing' | 'crm' | 'unlimited' | 'watermark'
}

const props = defineProps<Props>()
const licenseStore = useLicenseStore()

const featureConfig = {
  contribution: {
    name: 'Contribution System',
    icon: 'material-symbols:group',
    description: 'Contribute contract templates to the community',
    check: () => licenseStore.canContribute
  },
  printing: {
    name: 'PDF Printing', 
    icon: 'material-symbols:print',
    description: 'Export contracts as printable PDF documents',
    check: () => licenseStore.canPrint
  },
  crm: {
    name: 'CRM Integration',
    icon: 'material-symbols:link',
    description: 'Connect with CRM systems and additional cloud storage',
    check: () => licenseStore.currentLicense?.type === 'agent' || licenseStore.currentLicense?.type === 'industrial'
  },
  unlimited: {
    name: 'Unlimited Contracts',
    icon: 'material-symbols:all-inclusive',
    description: 'Create unlimited contracts without monthly limits',
    check: () => licenseStore.currentLicense?.type === 'industrial'
  },
  watermark: {
    name: 'No Watermark',
    icon: 'material-symbols:visibility-off',
    description: 'Export contracts without ChapaDocs watermark',
    check: () => licenseStore.currentLicense?.type === 'industrial'
  }
}

const featureInfo = featureConfig[props.feature]
const isAllowed = computed(() => featureInfo.check())

const featureName = featureInfo.name
const featureIcon = featureInfo.icon
const featureDescription = featureInfo.description

const upgradeLicense = () => {
  window.dispatchEvent(new CustomEvent('show-upgrade-modal'))
}
</script>