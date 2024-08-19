<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['total'])
const emit = defineEmits(['confirm', 'close'])

const amountPaid = ref('')
const change = computed(() => {
  const paid = parseFloat(amountPaid.value) || 0
  return Math.max(paid - props.total, 0).toFixed(2)
})

function addToAmount(value) {
  const currentAmount = parseFloat(amountPaid.value) || 0
  const addedAmount = parseFloat(value) || 0
  amountPaid.value = (currentAmount + addedAmount).toFixed(2)
}

function clearAmount() {
  amountPaid.value = ''
}

function confirmPayment() {
  if (parseFloat(amountPaid.value) < props.total) {
    alert('付款金額不足')
    return
  }
  emit('confirm', {
    paymentMethod: 'cash',
    amountPaid: parseFloat(amountPaid.value),
    change: parseFloat(change.value)
  })
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg w-96">
      <h2 class="text-2xl font-bold mb-4">結帳</h2>
      <p class="mb-2">總金額: ${{ total }}</p>
      <p class="mb-4">付款金額: ${{ amountPaid || '0' }}</p>
      <p class="mb-4">找零: ${{ change }}</p>
      <div class="grid grid-cols-3 gap-2 mb-4">
        <button v-for="n in 9" :key="n" @click="addToAmount(n)" class="bg-gray-200 p-2 rounded">
          {{ n }}
        </button>
        <button @click="addToAmount('0')" class="bg-gray-200 p-2 rounded">0</button>
        <button @click="addToAmount('00')" class="bg-gray-200 p-2 rounded">00</button>
        <button @click="clearAmount()" class="bg-red-500 text-white p-2 rounded">清除</button>
      </div>
      <div class="grid grid-cols-2 gap-2 mb-4">
        <button @click="addToAmount('1000')" class="bg-blue-500 text-white p-2 rounded">
          $1000
        </button>
        <button @click="addToAmount('500')" class="bg-blue-500 text-white p-2 rounded">$500</button>
        <button @click="addToAmount('100')" class="bg-blue-500 text-white p-2 rounded">$100</button>
        <button @click="addToAmount('50')" class="bg-blue-500 text-white p-2 rounded">$50</button>
      </div>
      <div class="flex justify-between">
        <button @click="confirmPayment" class="bg-green-500 text-white p-2 rounded">
          確認付款
        </button>
        <button @click="$emit('close')" class="bg-gray-500 text-white p-2 rounded">取消</button>
      </div>
    </div>
  </div>
</template>
