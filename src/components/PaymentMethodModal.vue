<script setup>
import { ref } from 'vue'

const props = defineProps(['total'])
const emit = defineEmits(['selectMethod', 'close'])

const paymentMethods = [
  { id: 'cash', name: '現金' },
  { id: 'youyou', name: '悠遊卡' },
  { id: 'linepay', name: 'LINE Pay' },
  { id: 'taiwanpay', name: 'Taiwan Pay' }
]

function selectPaymentMethod(method) {
  emit('selectMethod', method)
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg w-96">
      <h2 class="text-2xl font-bold mb-4">選擇支付方式</h2>
      <p class="mb-4">總金額: ${{ total }}</p>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="method in paymentMethods"
          :key="method.id"
          @click="selectPaymentMethod(method.id)"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {{ method.name }}
        </button>
      </div>
      <button @click="$emit('close')" class="mt-4 bg-gray-500 text-white p-2 rounded w-full">
        取消
      </button>
    </div>
  </div>
</template>
