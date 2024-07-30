<script setup>
import { defineProps } from 'vue'
import TransactionItem from './TransactionItem.vue'

const props = defineProps(['transactions'])
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Transaction History</h2>
    <div v-if="transactions.length === 0" class="text-gray-500">No transactions yet.</div>
    <TransactionItem
      v-for="transaction in transactions"
      :key="transaction.id"
      :transaction="transaction"
    />
  </div>
</template>
