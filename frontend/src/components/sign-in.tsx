import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style/SignIn.css'
import { Button, TextField, ThemeProvider } from '@mui/material'
import { theme } from '../style/Theme'
import { useAuth } from '../utils/auth'

const Signin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSignin = async () => {
    setError('')
    if (email && password) {
      try {
        const response = await login(email, password)
        if (!response.success) {
          setError(response.message || 'An error occurred during login.')
        } else {
          navigate('/dashboard')
        }
      } catch (error) {
        setError('An error occurred while logging in.')
        console.error(error)
      }
    } else {
      setError('Email and password must not be empty.')
    }
  }

  return (
    <div className='signin-wrapper'>
      <div className='signin-box'>
        <h1>Sign In</h1>
        <div className='input-fields'>
          <ThemeProvider theme={theme}>
            <TextField
              className='login-input-email'
              label='Email'
              value={email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value)
              }}
            />
            <TextField
              className='login-input-password'
              label='Password'
              type='password'
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value)
              }}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button onClick={handleSignin} variant='contained'>
              Login
            </Button>
            <p className='switch-signup'>
              Don't have an account?{' '}
              <Link className='signup-link' to='/signup'>
                Sign Up
              </Link>
            </p>
          </ThemeProvider>
        </div>
      </div>
    </div>
  )
}

export default Signin