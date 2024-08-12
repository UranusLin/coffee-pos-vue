<script setup>
import { ref, computed } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'
import TransactionList from '@/components/TransactionList.vue'

const transactionsStore = useTransactionsStore()
const dateFilter = ref('')

const transactions = computed(() => transactionsStore.getTransactions())

const filteredTransactions = computed(() => {
  let result = transactions.value

  if (dateFilter.value) {
    const filterDate = new Date(dateFilter.value)
    result = result.filter((transaction) => {
      const transactionDate = new Date(transaction.date)
      return transactionDate.toDateString() === filterDate.toDateString()
    })
  }

  return result.sort((a, b) => new Date(b.date) - new Date(a.date))
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Transactions</h1>
    <div class="mb-4">
      <label for="dateFilter" class="block text-sm font-medium text-gray-700"
        >Filter by date:</label
      >
      <input
        type="date"
        id="dateFilter"
        v-model="dateFilter"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
    <TransactionList :transactions="filteredTransactions" />
  </div>
</template>
