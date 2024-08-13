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

const totalSales = computed(() => {
  return filteredTransactions.value.reduce((sum, transaction) => sum + transaction.total, 0)
})

const totalCashPaid = computed(() => {
  return filteredTransactions.value
    .filter((t) => t.paymentMethod === 'cash')
    .reduce((sum, transaction) => sum + transaction.amountPaid, 0)
})

const totalChange = computed(() => {
  return filteredTransactions.value
    .filter((t) => t.paymentMethod === 'cash')
    .reduce((sum, transaction) => sum + transaction.change, 0)
})

const paymentMethodSummary = computed(() => {
  return filteredTransactions.value.reduce((summary, transaction) => {
    summary[transaction.paymentMethod] =
      (summary[transaction.paymentMethod] || 0) + transaction.total
    return summary
  }, {})
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
    <div class="mb-6 p-4 bg-gray-100 rounded">
      <h2 class="text-xl font-semibold mb-2">Summary</h2>
      <p>Total Sales: ${{ totalSales.toFixed(2) }}</p>
      <p>Total Cash Paid: ${{ totalCashPaid.toFixed(2) }}</p>
      <p>Total Change Given: ${{ totalChange.toFixed(2) }}</p>
      <h3 class="text-lg font-semibold mt-4 mb-2">Payment Methods:</h3>
      <ul>
        <li v-for="(amount, method) in paymentMethodSummary" :key="method">
          {{ method }}: ${{ amount.toFixed(2) }}
        </li>
      </ul>
    </div>
    <TransactionList :transactions="filteredTransactions" />
  </div>
</template>
