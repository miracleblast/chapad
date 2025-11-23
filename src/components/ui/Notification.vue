<template>
  <transition name="notification">
    <div 
      v-if="visible" 
      class="fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg border"
      :class="notificationClasses"
      role="alert"
    >
      <div class="flex items-start space-x-3">
        <Icon :icon="notificationIcon" class="text-xl mt-0.5 flex-shrink-0" />
        <div class="flex-1">
          <p class="font-medium text-sm">{{ message }}</p>
          <p v-if="description" class="text-xs opacity-90 mt-1">{{ description }}</p>
          <div v-if="progress !== null" class="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div 
              class="h-1 rounded-full transition-all duration-300"
              :class="progressBarColor"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
        <button @click="close" class="flex-shrink-0 hover:opacity-70 transition-opacity">
          <Icon icon="material-symbols:close" class="text-lg" />
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, watch, computed } from 'vue'

interface Props {
  message: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning' | 'loading'
  duration?: number
  progress?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
  progress: null
})

const visible = ref(false)
let timeoutId: number | null = null

const notificationClasses = computed(() => {
  const baseClasses = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
    warning: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300',
    loading: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
  }
  return baseClasses[props.type]
})

const notificationIcon = computed(() => {
  const icons = {
    success: 'material-symbols:check-circle',
    error: 'material-symbols:error',
    info: 'material-symbols:info',
    warning: 'material-symbols:warning',
    loading: 'material-symbols:progress-activity'
  }
  return icons[props.type]
})

const progressBarColor = computed(() => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-orange-500',
    loading: 'bg-blue-500'
  }
  return colors[props.type]
})

const close = () => {
  visible.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

const show = () => {
  visible.value = true
  if (props.duration > 0 && props.type !== 'loading') {
    timeoutId = setTimeout(close, props.duration)
  }
}

// Auto-hide after duration
watch(() => props.duration, (newDuration) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  if (newDuration > 0 && props.type !== 'loading') {
    timeoutId = setTimeout(close, newDuration)
  }
})

// Expose methods
defineExpose({
  show,
  close
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