<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'
import TransactionList from '@/components/TransactionList.vue'

const transactionsStore = useTransactionsStore()
const filterType = ref('day')
const filterDate = ref(new Date().toISOString().split('T')[0])

onMounted(() => {
  transactionsStore.fetchTransactions()
})

const transactions = computed(() => transactionsStore.getTransactions())

const filteredTransactions = computed(() => {
  let result = transactions.value
  const currentDate = new Date(filterDate.value)

  switch (filterType.value) {
    case 'day':
      result = result.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        return transactionDate.toDateString() === currentDate.toDateString()
      })
      break
    case 'week':
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      result = result.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        return transactionDate >= weekStart && transactionDate <= weekEnd
      })
      break
    case 'month':
      result = result.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        return (
          transactionDate.getFullYear() === currentDate.getFullYear() &&
          transactionDate.getMonth() === currentDate.getMonth()
        )
      })
      break
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

function formatDateRange() {
  const currentDate = new Date(filterDate.value)
  switch (filterType.value) {
    case 'day':
      return currentDate.toLocaleDateString()
    case 'week':
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`
    case 'month':
      return `${currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Transactions</h1>
    <div class="mb-4 flex items-center space-x-4">
      <div>
        <label for="filterType" class="block text-sm font-medium text-gray-700">Filter type:</label>
        <select
          id="filterType"
          v-model="filterType"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
      <div>
        <label for="filterDate" class="block text-sm font-medium text-gray-700">Filter date:</label>
        <input
          type="date"
          id="filterDate"
          v-model="filterDate"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
    </div>
    <div class="mb-6 p-4 bg-gray-100 rounded">
      <h2 class="text-xl font-semibold mb-2">Summary for {{ formatDateRange() }}</h2>
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
