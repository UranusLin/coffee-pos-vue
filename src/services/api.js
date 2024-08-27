import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getMenu() {
    return apiClient.get('/menu')
  },
  addTransaction(transaction) {
    return apiClient.post('/transactions', transaction)
  },
  getTransactions() {
    return apiClient.get('/transactions')
  },
  getIngredients() {
    return apiClient.get('/ingredients')
  },
  updateIngredient(ingredient, data) {
    return apiClient.patch(`/ingredients/${ingredient}`, data)
  },
  getRecipes() {
    return apiClient.get('/recipes')
  }
}
