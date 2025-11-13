<template>
  <div class="contract-form">
    <div class="space-y-6">
      <!-- Dynamic form fields based on template -->
      <div 
        v-for="field in templateFields" 
        :key="field.key"
        class="chapa-glass-card p-5"
      >
        <label class="block text-sm font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500 text-xs ml-1">*</span>
        </label>

        <!-- Text Input -->
        <input 
          v-if="field.type === 'text'"
          v-model="formData[field.key]"
          type="text"
          :placeholder="field.placeholder"
          class="input-modern w-full"
          :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && field.required && !formData[field.key] }"
        >

        <!-- Number Input -->
        <input 
          v-else-if="field.type === 'number'"
          v-model="formData[field.key]"
          type="number"
          :placeholder="field.placeholder"
          class="input-modern w-full"
          :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && field.required && !formData[field.key] }"
        >

        <!-- Date Input -->
        <input 
          v-else-if="field.type === 'date'"
          v-model="formData[field.key]"
          type="date"
          class="input-modern w-full"
          :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && field.required && !formData[field.key] }"
        >

        <!-- Select Input -->
        <select 
          v-else-if="field.type === 'select'"
          v-model="formData[field.key]"
          class="input-modern w-full"
          :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && field.required && !formData[field.key] }"
        >
          <option value="">Select {{ field.label }}</option>
          <option 
            v-for="option in field.options" 
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>

        <!-- Textarea Input -->
        <textarea 
          v-else-if="field.type === 'textarea'"
          v-model="formData[field.key]"
          :placeholder="field.placeholder"
          rows="4"
          class="input-modern w-full resize-none"
          :class="{ 'border-red-300 ring-1 ring-red-300': showErrors && field.required && !formData[field.key] }"
        ></textarea>

        <!-- Checkbox Input -->
        <div v-else-if="field.type === 'checkbox'" class="flex items-center space-x-3">
          <input 
            v-model="formData[field.key]"
            type="checkbox"
            class="w-4 h-4 text-chapa-purple-500 border-gray-300 rounded focus:ring-chapa-purple-500"
          >
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ field.placeholder }}</span>
        </div>

        <p v-if="field.placeholder && field.type !== 'checkbox'" class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ field.placeholder }}
        </p>
      </div>

      <!-- Validation Summary -->
      <div 
        v-if="showErrors && !isFormValid" 
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
      >
        <div class="flex items-start space-x-3">
          <Icon icon="material-symbols:error" class="text-red-500 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="font-semibold text-red-800 dark:text-red-300 text-sm">Please complete all required fields</h4>
            <p class="text-red-700 dark:text-red-400 text-xs mt-1">Fill in the missing information above to continue</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'
import type { TemplateField } from '@/utils/templates'

interface Props {
  templateFields: TemplateField[]
  initialData?: Record<string, any>
  showErrors?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  templateFields: () => [],
  initialData: () => ({}),
  showErrors: false
})

const emit = defineEmits<{
  'update:modelValue': [data: Record<string, any>]
  'validation': [isValid: boolean]
}>()

// Form data
const formData = ref<Record<string, any>>({})

// Initialize form data
const initializeFormData = () => {
  const data: Record<string, any> = {}
  props.templateFields.forEach(field => {
    data[field.key] = props.initialData[field.key] || ''
  })
  formData.value = data
}

// Computed
const isFormValid = computed(() => {
  return props.templateFields.every(field => 
    !field.required || (formData.value[field.key] && formData.value[field.key].toString().trim())
  )
})

// Watch for changes
watch(formData, (newData) => {
  emit('update:modelValue', newData)
  emit('validation', isFormValid.value)
}, { deep: true })

// Watch template fields changes
watch(() => props.templateFields, () => {
  initializeFormData()
}, { immediate: true })

// Watch initial data changes
watch(() => props.initialData, () => {
  initializeFormData()
})
</script>