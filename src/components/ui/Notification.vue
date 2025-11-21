<template>
  <transition name="notification">
    <div 
      v-if="visible" 
      class="fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg border"
      :class="notificationClasses"
    >
      <div class="flex items-start space-x-3">
        <Icon :icon="notificationIcon" class="text-xl mt-0.5 flex-shrink-0" />
        <div class="flex-1">
          <p class="font-medium text-sm">{{ message }}</p>
          <p v-if="description" class="text-xs opacity-90 mt-1">{{ description }}</p>
        </div>
        <button @click="visible = false" class="flex-shrink-0">
          <Icon icon="material-symbols:close" class="text-lg" />
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, watch } from 'vue'

interface Props {
  message: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000
})

const visible = ref(false)

const notificationClasses = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
  warning: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300'
}

const notificationIcon = {
  success: 'material-symbols:check-circle',
  error: 'material-symbols:error',
  info: 'material-symbols:info',
  warning: 'material-symbols:warning'
}

// Auto-hide after duration
watch(visible, (newVal) => {
  if (newVal && props.duration > 0) {
    setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
})

// Expose show/hide methods
defineExpose({
  show: () => visible.value = true,
  hide: () => visible.value = false
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>