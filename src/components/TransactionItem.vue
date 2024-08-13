<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps(['transaction'])

function formatDate(date) {
  return new Date(date).toLocaleString()
}

const paymentMethodInfo = computed(() => {
  const methods = {
    cash: { name: '現金', icon: 'fas fa-money-bill-wave', color: 'text-green-600' },
    youyou: { name: '悠遊卡', icon: 'fas fa-credit-card', color: 'text-blue-600' },
    linepay: { name: 'LINE Pay', icon: 'fab fa-line', color: 'text-green-500' },
    taiwanpay: { name: 'Taiwan Pay', icon: 'fas fa-mobile-alt', color: 'text-red-600' }
  }
  const method = methods[props.transaction.paymentMethod]
  if (method) {
    return method
  } else {
    console.log('Unknown payment method:', props.transaction.paymentMethod)
    return {
      name: props.transaction.paymentMethod || 'Unknown',
      icon: 'fas fa-question-circle',
      color: 'text-gray-600'
    }
  }
})

const showCashDetails = computed(() => props.transaction.paymentMethod === 'cash')
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-4 mb-4">
    <div class="flex justify-between items-center mb-2">
      <span class="font-bold text-lg">Order #{{ transaction.id }}</span>
      <span class="text-gray-500">{{ formatDate(transaction.date) }}</span>
    </div>
    <ul class="mb-2">
      <li v-for="item in transaction.items" :key="item.id" class="text-sm text-gray-600">
        {{ item.name }} ({{ item.customization.size }}, {{ item.customization.temperature }}) - ${{
          item.price.toFixed(2)
        }}
      </li>
    </ul>
    <div class="mt-4 flex justify-between items-end">
      <div class="flex items-center">
        <i :class="[paymentMethodInfo.icon, paymentMethodInfo.color, 'text-xl mr-2']"></i>
        <span :class="[paymentMethodInfo.color, 'font-semibold']">
          {{ paymentMethodInfo.name || 'Payment method not available' }}
        </span>
      </div>
      <div class="text-right">
        <div class="font-bold text-lg">Total: ${{ transaction.total.toFixed(2) }}</div>
        <template v-if="showCashDetails">
          <div class="text-sm text-gray-600">
            Amount Paid: ${{ transaction.amountPaid.toFixed(2) }}
          </div>
          <div class="text-sm text-gray-600">Change: ${{ transaction.change.toFixed(2) }}</div>
        </template>
      </div>
    </div>
  </div>
</template>
