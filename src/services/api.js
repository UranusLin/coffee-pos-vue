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
  }
}
