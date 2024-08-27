import { defineStore } from 'pinia'
import api from '@/services/api'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: []
  }),
  actions: {
    async addTransaction(transaction) {
      try {
        const response = await api.addTransaction(transaction)
        this.transactions.push(response.data)
      } catch (error) {
        console.error('Error adding transaction:', error)
      }
    },
    async fetchTransactions() {
      try {
        const response = await api.getTransactions()
        this.transactions = response.data
      } catch (error) {
        console.error('Error get transaction:', error)
      }
    },
    getTransactions() {
      return this.transactions
    }
  }
})
