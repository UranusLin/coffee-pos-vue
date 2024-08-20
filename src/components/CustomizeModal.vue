<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps(['item', 'existItem'])
const emit = defineEmits(['add', 'close'])

const quantity = ref(1)

const customization = ref({
  size: '',
  temperature: '',
  sugarLevel: '',
  iceLevel: ''
})

onMounted(() => {
  if (props.existItem) {
    customization.value = { ...props.existItem.customization }
    quantity.value = props.existItem.quantity
  } else {
    customization.value = {
      size: props.item.sizes[1],
      temperature: props.item.temperatures[1],
      sugarLevel: props.item.sugarLevels[0],
      iceLevel: props.item.iceLevels[1]
    }
  }
})

function addToOrder() {
  emit('add', { ...props.item, customization: customization.value, quantity: quantity.value })
  closeModal()
}

function closeModal() {
  emit('close')
}

function updateCustomization(type, value) {
  customization.value[type] = value
}

function incrementQuantity() {
  quantity.value++
}

function decrementQuntity() {
  quantity.value--
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-30 overflow-y-auto h-full w-full" id="my-modal">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <h3 class="text-lg font-bold mb-4">Customize {{ item.name }}</h3>

      <div class="mb-4">
        <label class="block mb-2">Size:</label>
        <div class="flex space-x-2">
          <button
            v-for="size in item.sizes"
            :key="size"
            @click="updateCustomization('size', size)"
            :class="[
              'px-3 py-2 rounded',
              customization.size === size
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            ]"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block mb-2">Temperature:</label>
        <div class="flex space-x-2">
          <button
            v-for="temp in item.temperatures"
            :key="temp"
            @click="updateCustomization('temperature', temp)"
            :class="[
              'px-3 py-2 rounded',
              customization.temperature === temp
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            ]"
          >
            {{ temp }}
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block mb-2">Sugar Level:</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="sugar in item.sugarLevels"
            :key="sugar"
            @click="updateCustomization('sugarLevel', sugar)"
            :class="[
              'px-3 py-2 rounded',
              customization.sugarLevel === sugar
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            ]"
          >
            {{ sugar }}
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block mb-2">Ice Level:</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="ice in item.iceLevels"
            :key="ice"
            @click="updateCustomization('iceLevel', ice)"
            :class="[
              'px-3 py-2 rounded',
              customization.iceLevel === ice
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            ]"
          >
            {{ ice }}
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block mb-2">Quantity</label>
        <div class="flex items-center space-x-2">
          <button @click="decrementQuntity" class="p-3 py-2 bg-gray-200 rounded">-</button>
          <span class="px-3 py-2">{{ quantity }}</span>
          <button @click="incrementQuantity" class="p-3 py-2 bg-gray-200 rounded">+</button>
        </div>
      </div>

      <div class="mt-4 flex justify-end space-x-2">
        <button
          @click="addToOrder"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add to Order
        </button>
        <button
          @click="closeModal"
          class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
