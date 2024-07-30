import { defineStore } from 'pinia'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: []
  }),
  actions: {
    addTransaction(transaction) {
      this.transactions.push(transaction)
    },
    getTransactions() {
      return this.transactions
    }
  }
})
