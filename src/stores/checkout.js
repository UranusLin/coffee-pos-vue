import { defineStore } from 'pinia'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    transactions: []
  }),
  actions: {
    completeOrder(transaction) {
      this.transactions.push(transaction)
    }
  }
})
