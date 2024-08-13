<script setup>
import TransactionItem from './TransactionItem.vue'

defineProps({
  transactions: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div>
    <TransactionItem
      v-for="transaction in transactions"
      :key="transaction.id"
      :transaction="transaction"
    />
  </div>
</template>
