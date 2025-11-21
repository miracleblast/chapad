<template>
  <div class="signature-pad-container">
    <!-- Signature Modes Tabs -->
    <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex-1 py-3 text-sm font-medium transition-colors"
        :class="activeTab === tab.id 
          ? 'text-chapa-purple-600 border-b-2 border-chapa-purple-600' 
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
      >
        <Icon :icon="tab.icon" class="text-lg mb-1" />
        <div>{{ tab.name }}</div>
      </button>
    </div>

    <!-- Draw Signature -->
    <div v-if="activeTab === 'draw'" class="space-y-4">
      <div class="signature-pad h-64 w-full" ref="canvasContainer">
        <canvas 
          ref="canvas"
          class="w-full h-full touch-none bg-white dark:bg-gray-800 rounded-lg"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="startDrawing"
          @touchmove="draw"
          @touchend="stopDrawing"
        ></canvas>
      </div>

      <div class="flex justify-between items-center">
        <button 
          @click="clearCanvas"
          class="btn-secondary flex items-center space-x-2 px-4 py-2"
        >
          <Icon icon="material-symbols:delete" />
          <span>Clear</span>
        </button>

        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <Icon icon="material-symbols:info" />
          <span>Draw your signature above</span>
        </div>
      </div>
    </div>

    <!-- Type Signature -->
    <div v-else-if="activeTab === 'type'" class="space-y-4">
      <!-- ENHANCED: More font options -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <button
          v-for="font in availableFonts"
          :key="font.id"
          @click="selectedFont = font.id"
          class="px-3 py-2 rounded-lg border transition-colors text-xs"
          :class="selectedFont === font.id
            ? 'border-chapa-purple-500 bg-chapa-purple-50 dark:bg-chapa-purple-900/20 text-chapa-purple-700 dark:text-chapa-purple-300'
            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'"
          :style="{ fontFamily: font.family }"
        >
          {{ font.name }}
        </button>
      </div>

      <input
        v-model="typedSignature"
        type="text"
        placeholder="Type your full name"
        class="input-modern w-full text-center text-2xl"
        :style="{ fontFamily: selectedFontFamily }"
        maxlength="50"
      >

      <div class="text-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg min-h-20 flex items-center justify-center bg-white dark:bg-gray-800">
        <span 
          v-if="typedSignature"
          class="text-3xl"
          :style="{ fontFamily: selectedFontFamily, color: signatureColor }"
        >
          {{ typedSignature }}
        </span>
        <span v-else class="text-gray-400 text-sm">
          Your signature will appear here
        </span>
      </div>

      <!-- ENHANCED: Color picker for text signatures -->
      <div v-if="typedSignature" class="flex items-center space-x-3">
        <span class="text-sm text-gray-600 dark:text-gray-400">Color:</span>
        <div class="flex space-x-1">
          <button
            v-for="color in signatureColors"
            :key="color"
            @click="signatureColor = color"
            class="w-6 h-6 rounded-full border-2 transition-transform"
            :class="signatureColor === color ? 'border-gray-800 dark:border-gray-200 scale-110' : 'border-gray-300'"
            :style="{ backgroundColor: color }"
          ></button>
        </div>
      </div>
    </div>

    <!-- Upload Signature -->
    <div v-else-if="activeTab === 'upload'" class="space-y-4">
      <div 
        @click="triggerFileInput"
        @dragover="handleDragOver"
        @drop="handleDrop"
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-chapa-purple-400"
        :class="{ 'border-chapa-purple-500 bg-chapa-purple-50 dark:bg-chapa-purple-900/20': isDragging }"
      >
        <Icon icon="material-symbols:upload" class="text-4xl text-gray-400 mb-3 mx-auto" />
        
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Upload your signature image
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500">
          PNG or JPG, max 500KB
        </p>

        <input
          ref="fileInput"
          type="file"
          accept=".png,.jpg,.jpeg"
          @change="handleFileSelect"
          class="hidden"
        >
      </div>

      <!-- Preview uploaded image -->
      <div v-if="uploadedImage" class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
        <img 
          :src="uploadedImage" 
          alt="Signature preview"
          class="max-h-32 mx-auto border border-gray-200 dark:border-gray-700 rounded"
        >
        <button 
          @click="removeUploadedImage"
          class="text-red-500 text-sm mt-2 flex items-center space-x-1 mx-auto"
        >
          <Icon icon="material-symbols:delete" />
          <span>Remove</span>
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button 
        @click="$emit('cancel')"
        class="btn-secondary flex-1"
      >
        Cancel
      </button>
      <button 
        @click="saveSignature"
        :disabled="!hasSignature"
        class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Signature
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface SignatureData {
  type: 'draw' | 'text' | 'image'
  data: string
  font?: string
  color?: string
}

const emit = defineEmits<{
  saved: [signature: SignatureData]
  cancel: []
}>()

// Tabs
const tabs = [
  { id: 'draw' as const, name: 'Draw', icon: 'material-symbols:draw' },
  { id: 'type' as const, name: 'Type', icon: 'material-symbols:text-fields' },
  { id: 'upload' as const, name: 'Upload', icon: 'material-symbols:upload' }
]

const activeTab = ref<'draw' | 'type' | 'upload'>('draw')

// Draw signature
const canvas = ref<HTMLCanvasElement>()
const canvasContainer = ref<HTMLElement>()
const isDrawing = ref(false)
const lastX = ref(0)
const lastY = ref(0)

// Type signature - ENHANCED: More fonts and colors
const typedSignature = ref('')
const selectedFont = ref('cursive')
const signatureColor = ref('#000000') // NEW: Color for text signatures

// ENHANCED: More font options
const availableFonts = [
  { id: 'cursive', name: 'Cursive', family: 'cursive' },
  { id: 'dancing', name: 'Dancing', family: '"Dancing Script", cursive' },
  { id: 'great', name: 'Great Vibes', family: '"Great Vibes", cursive' },
  { id: 'parisienne', name: 'Parisienne', family: '"Parisienne", cursive' }, // NEW
  { id: 'sacramento', name: 'Sacramento', family: '"Sacramento", cursive' }, // NEW
  { id: 'clicker', name: 'Clicker', family: '"Clicker Script", cursive' } // NEW
]

// ENHANCED: Signature colors
const signatureColors = [
  '#000000', // Black
  '#7C3AED', // Chapa Purple
  '#EA580C', // Chapa Orange
  '#DC2626', // Red
  '#2563EB', // Blue
  '#059669'  // Green
]

// Upload signature
const fileInput = ref<HTMLInputElement>()
const uploadedImage = ref('')
const isDragging = ref(false)

// Computed
const selectedFontFamily = computed(() => {
  return availableFonts.find(font => font.id === selectedFont.value)?.family || 'cursive'
})

const hasSignature = computed(() => {
  switch (activeTab.value) {
    case 'draw':
      return true // Assume user has drawn something
    case 'type':
      return typedSignature.value.trim().length > 0
    case 'upload':
      return uploadedImage.value.length > 0
    default:
      return false
  }
})

// Canvas setup
onMounted(() => {
  setupCanvas()
  window.addEventListener('resize', setupCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', setupCanvas)
})

const setupCanvas = () => {
  if (!canvas.value || !canvasContainer.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // Set canvas size
  const rect = canvasContainer.value.getBoundingClientRect()
  canvas.value.width = rect.width
  canvas.value.height = rect.height

  // Set drawing style
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

// Drawing functions
const startDrawing = (e: MouseEvent | TouchEvent) => {
  isDrawing.value = true
  const coords = getCoordinates(e)
  lastX.value = coords.x
  lastY.value = coords.y
}

const draw = (e: MouseEvent | TouchEvent) => {
  if (!isDrawing.value || !canvas.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const coords = getCoordinates(e)

  ctx.beginPath()
  ctx.moveTo(lastX.value, lastY.value)
  ctx.lineTo(coords.x, coords.y)
  ctx.stroke()

  lastX.value = coords.x
  lastY.value = coords.y

  // Prevent scrolling on touch devices
  e.preventDefault()
}

const stopDrawing = () => {
  isDrawing.value = false
}

const getCoordinates = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
  if (!canvas.value) return { x: 0, y: 0 }

  const rect = canvas.value.getBoundingClientRect()
  
  if ('touches' in e) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    }
  } else {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }
}

const clearCanvas = () => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
}

// File upload functions
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processImageFile(file)
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    processImageFile(files[0])
  }
}

const processImageFile = (file: File) => {
  // Validate file
  if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
    alert('Please upload a PNG or JPEG image')
    return
  }

  if (file.size > 500 * 1024) {
    alert('Image must be smaller than 500KB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeUploadedImage = () => {
  uploadedImage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Save signature - ENHANCED: Include font and color data
const saveSignature = () => {
  let signatureData: SignatureData

  switch (activeTab.value) {
    case 'draw':
      if (!canvas.value) return
      signatureData = {
        type: 'draw',
        data: canvas.value.toDataURL('image/png')
      }
      break

    case 'type':
      signatureData = {
        type: 'text',
        data: typedSignature.value.trim(),
        font: selectedFontFamily.value, // ENHANCED: Include font
        color: signatureColor.value     // ENHANCED: Include color
      }
      break

    case 'upload':
      signatureData = {
        type: 'image',
        data: uploadedImage.value
      }
      break

    default:
      return
  }

  emit('saved', signatureData)
}

// ENHANCED: Reset function when switching tabs
const resetTabData = () => {
  // This could be enhanced to reset specific tab data when switching
}

// Watch for tab changes to potentially reset data
// You could add watchers here if needed
</script>

<style scoped>
.signature-pad {
  touch-action: none; /* Prevent scrolling while drawing on mobile */
}

/* Mobile-optimized touch targets */
button {
  min-height: 44px;
}

/* Smooth transitions */
.signature-pad-container {
  transition: all 0.3s ease;
}

/* Custom scrollbar for mobile */
@media (max-width: 768px) {
  .signature-pad-container {
    max-height: 80vh;
    overflow-y: auto;
  }
}

/* ENHANCED: Better font preview for text signatures */
.font-preview {
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

/* ENHANCED: Color picker styles */
.color-picker {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-option {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #374151;
  transform: scale(1.15);
}
</style>