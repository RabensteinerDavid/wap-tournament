import { useState } from 'react'
import { isLoggedIn, login } from '../controller/userController'
import { useNavigate } from 'react-router-dom'
import Logout from './logout'
import '../style/SignIn.css'
import { Button, TextField, ThemeProvider } from '@mui/material'
import { theme } from '../style/Theme'

const Signin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSignin = async () => {
    setError('')

    if (!isLoggedIn()) {
      if (email && password) {
        try {
          const response = await login(email, password)
          if (response.success) {
            navigate('/home')
          } else {
            setError(response.message || 'An error occurred during login.')
          }
        } catch (error) {
          setError('An error occurred while logging in.')
          console.error(error)
        }
      } else {
        setError('Email and password must not be empty.')
      }
    } else {
      setError('You are already logged in')
    }
  }

  return (
    <div className='signin-wrapper'>
      <div className='signin-box'>
        <h1>Sign In</h1>
        <Logout />
        {!isLoggedIn() && (
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
            </ThemeProvider>
          </div>
        )}
      </div>
    </div>
  )
}

export default Signin