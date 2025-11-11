<template>
  <div class="min-h-screen bg-chapa-sand-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Main Content -->
    <main class="pb-20"> <!-- Padding for bottom nav -->
      <RouterView />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 z-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-3">
          <!-- Contracts -->
          <RouterLink 
            to="/" 
            class="flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-300"
            :class="currentRoute === 'home' 
              ? 'text-chapa-purple-600 dark:text-chapa-purple-400 bg-chapa-purple-50 dark:bg-chapa-purple-900/20' 
              : 'text-gray-500 hover:text-chapa-purple-500'"
          >
            <Icon icon="material-symbols:contract" class="text-2xl" />
            <span class="text-xs font-poppins font-medium">Contracts</span>
          </RouterLink>

          <!-- Templates -->
          <RouterLink 
            to="/templates" 
            class="flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-300"
            :class="currentRoute === 'templates' 
              ? 'text-chapa-purple-600 dark:text-chapa-purple-400 bg-chapa-purple-50 dark:bg-chapa-purple-900/20' 
              : 'text-gray-500 hover:text-chapa-purple-500'"
          >
            <Icon icon="material-symbols:library-books" class="text-2xl" />
            <span class="text-xs font-poppins font-medium">Templates</span>
          </RouterLink>

          <!-- Contribution -->
          <RouterLink 
            to="/contribution" 
            class="flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-300"
            :class="currentRoute === 'contribution' 
              ? 'text-chapa-orange-600 dark:text-chapa-orange-400 bg-chapa-orange-50 dark:bg-chapa-orange-900/20' 
              : 'text-gray-500 hover:text-chapa-orange-500'"
          >
            <Icon icon="material-symbols:group" class="text-2xl" />
            <span class="text-xs font-poppins font-medium">Contribute</span>
          </RouterLink>

          <!-- Documents -->
          <RouterLink 
            to="/documents" 
            class="flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-300"
            :class="currentRoute === 'documents' 
              ? 'text-chapa-purple-600 dark:text-chapa-purple-400 bg-chapa-purple-50 dark:bg-chapa-purple-900/20' 
              : 'text-gray-500 hover:text-chapa-purple-500'"
          >
            <Icon icon="material-symbols:folder" class="text-2xl" />
            <span class="text-xs font-poppins font-medium">My Docs</span>
          </RouterLink>

          <!-- Settings -->
          <RouterLink 
            to="/settings" 
            class="flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-300"
            :class="currentRoute === 'settings' 
              ? 'text-chapa-purple-600 dark:text-chapa-purple-400 bg-chapa-purple-50 dark:bg-chapa-purple-900/20' 
              : 'text-gray-500 hover:text-chapa-purple-500'"
          >
            <Icon icon="material-symbols:settings" class="text-2xl" />
            <span class="text-xs font-poppins font-medium">Settings</span>
          </RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const route = useRoute()
const currentRoute = computed(() => route.name as string)
</script>