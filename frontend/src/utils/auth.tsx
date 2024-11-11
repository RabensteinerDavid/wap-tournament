import React, { createContext, useState, useEffect, useContext } from 'react'
import {
  login as loginService,
  signup as signupService
} from '../controller/userController'
import { AuthContextType, Props } from '@g-loot/react-tournament-brackets'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem('token')
  )

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [])

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const result = await loginService(email, password)
      if (result.success && result.data) {
        console.log(result.data)
        localStorage.setItem('token', result.data)
        setIsLoggedIn(true)
        return { success: true }
      } else {
        return { success: false, message: result.message || 'Login failed' }
      }
    } catch (error) {
      return { success: false, message: 'An error occurred during login' }
    }
  }

  const signup = async (
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const result = await signupService(username, email, password)
      if (result.success) {
        return { success: true }
      } else {
        return { success: false, message: result.message || 'Signup failed' }
      }
    } catch (error) {
      return { success: false, message: 'An error occurred during signup' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
