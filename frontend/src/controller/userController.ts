import api from '../service/axiosInstance'

export const login = async (
  email: string,
  password: string
): Promise<{ success: boolean; data?: {token: string, refreshToken: string}; message?: string }> => {
  return api
    .post('/login', {
      email,
      password
    })
    .then(response => {
      const data = response.data
      if (data.token) {
        return { success: true, data: {token: data.token, refreshToken: data.refreshToken} }
      } else {
        return { success: false, message: data.error || 'Login failed' }
      }
    })
    .catch(error => {
      return {
        success: false,
        message: error.response.data.error || 'Network error occurred.'
      }
    })
}

export const signup = async (
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; data?: string; message?: string }> => {
  return api
    .post('/register', {
      username,
      email,
      password
    })
    .then(response => {
      const data = response.data

      if (data.message) {
        return { success: true, data: data.message }
      }
      if (data.error) {
        return { success: false, message: data.error }
      }
      return { success: false, message: 'Register failed' }
    })
    .catch(error => {
      return {
        success: false,
        message: error.response.data.error || 'Network error occurred.'
      }
    })
}

export const getUser = async (): Promise<{ success: boolean; data?: {username: string, email: string, id: string}; message?: string }> => {
  return await api
    .get('/user')
    .then(response => {
      const data = response.data
      if (!data.error) {
        return { success: true, data: {username: data.username, email: data.email, id: data.id} }
      } else {
        return { success: false, message: data.error || 'Login failed' }
      }
    })
    .catch(error => {
      return {
        success: false,
        message: error.response.data.error || 'Network error occurred.'
      }
    })
}

export const acctivateAccount = async (verificationToken: string): Promise<{ success: boolean; data?: string; message?: string }> => {
  return await api
    .patch('/verify',{
      verificationToken
    })
    .then(response => {
      const data = response.data
      if (!data.error) {
        return { success: true, data: "Activation successfully" }
      } else {
        return { success: false, message: data.error || 'Login failed' }
      }
    })
    .catch(error => {
      return {
        success: false,
        message: error.response.data.error || 'Network error occurred.'
      }
    })
}