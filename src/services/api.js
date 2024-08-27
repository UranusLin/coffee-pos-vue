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
  getIngredient(id) {
    return apiClient.get(`/ingredients/${id}`)
  },
  updateIngredient(id, data) {
    return apiClient.patch(`/ingredients/${id}`, data)
  },
  getRecipes() {
    return apiClient.get('/recipes')
  }
}
