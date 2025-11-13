<template>
  <div class="min-h-screen p-6">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="bird-nod mb-4">
        <Icon icon="noto:bird" class="text-6xl text-chapa-purple-600" />
      </div>
      <h1 class="text-4xl font-cal text-gradient-purple mb-2">ChapaDocs</h1>
      <p class="text-gray-600 dark:text-gray-300 font-poppins">
        Official business documents made in Africa
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <!-- New Contract - Goes to Type Selector -->
     <RouterLink 
  to="/select-type" 
  class="chapa-glass-card p-6 text-center card-hover"
>
  <Icon icon="material-symbols:add-circle" class="text-3xl text-chapa-purple-600 mb-2" />
  <h3 class="font-semibold text-gray-800 dark:text-white font-poppins">New Contract</h3>
  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Choose type first</p>
</RouterLink>

      <!-- Templates - Goes to Templates Gallery -->
      <RouterLink 
        to="/templates" 
        class="chapa-glass-card p-6 text-center card-hover"
      >
        <Icon icon="material-symbols:library-books" class="text-3xl text-chapa-orange-500 mb-2" />
        <h3 class="font-semibold text-gray-800 dark:text-white font-poppins">Templates</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Browse all templates</p>
      </RouterLink>
    </div>


    <!-- Recent Documents -->
    <div class="chapa-glass-card p-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-poppins">
        Recent Documents
      </h3>
      <div class="space-y-3">
        <div 
          v-for="doc in recentDocuments" 
          :key="doc.id"
          class="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-700/50"
        >
          <div class="flex items-center space-x-3">
            <Icon :icon="doc.icon" class="text-chapa-purple-500 text-xl" />
            <div>
              <div class="font-medium text-gray-800 dark:text-white font-poppins">
                {{ doc.name }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ doc.date }}
              </div>
            </div>
          </div>
          <Icon icon="material-symbols:chevron-right" class="text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mt-6">
      <div class="text-center">
        <div class="text-2xl font-bold text-chapa-purple-600 font-cal">{{ stats.contracts }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400 font-poppins">Contracts</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-chapa-orange-500 font-cal">{{ stats.templates }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400 font-poppins">Templates</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-chapa-sand-500 font-cal">{{ stats.contributions }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400 font-poppins">Contributions</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const recentDocuments = ref([
  {
    id: 1,
    name: 'Sales Agreement',
    date: '2 hours ago',
    icon: 'material-symbols:contract'
  },
  {
    id: 2,
    name: 'Service Contract',
    date: '1 day ago',
    icon: 'material-symbols:description'
  }
])

const stats = ref({
  contracts: 12,
  templates: 5,
  contributions: 3
})
</script>