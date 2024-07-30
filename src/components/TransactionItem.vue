<script setup>
import { defineProps } from 'vue'

const props = defineProps(['transaction'])

function formatDate(date) {
  return new Date(date).toLocaleString()
}
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
          item.price
        }}
      </li>
    </ul>
    <div class="text-right font-bold">Total: ${{ transaction.total }}</div>
  </div>
</template>
