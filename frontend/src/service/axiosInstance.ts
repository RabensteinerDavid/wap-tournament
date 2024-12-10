import axios from 'axios'
import { navigateTo } from '../controller/navigationController'

const API_BASE_URL: string | undefined = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('token')
const refreshToken = localStorage.getItem('refreshToken')

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL not set')
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`
} else {
  console.log('No token found')
}

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const originalRequest = error.config
      const response = await api.post('/refresh-token', { refreshToken })
      const data = response.data

      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken)
        api.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`
        return axios(originalRequest)
      }
    }
    if (error.response?.status === 403) {
      navigateTo('/signin')
    }

    return Promise.reject(error)
  }
)

export default api
