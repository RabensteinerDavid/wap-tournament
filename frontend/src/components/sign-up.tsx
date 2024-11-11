import { useState } from 'react'
import { isLoggedIn, signup } from '../controller/userController'
import { useNavigate } from 'react-router-dom'
import Logout from './logout'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../style/Theme'
import { Button, TextField } from '@mui/material'
import '../style/SignUp.css'

const Signup = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSignUp = async () => {
    setError('')
    if (!isLoggedIn()) {
      if (email && password && username) {
        try {
          const response = await signup(username, email, password)
          if (response.success) {
            navigate('/signin')
          } else {
            setError(response.message || 'An error occurred during login.')
          }
        } catch (error) {
          setError('An error occurred while logging in.')
          console.error(error)
        }
      } else {
        setError('Username, Email and password must not be empty.')
      }
    } else {
      setError('You are already logged in')
    }
  }

  return (
    <div className='signup-wrapper'>
      <div className='signup-box'>
        <h1>Sign Up</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <Logout />
          {!isLoggedIn() && (
            <div className='input-fields'>
              <ThemeProvider theme={theme}>
                <TextField
                  className='signup-input-username'
                  label='Username'
                  value={username}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setUsername(event.target.value)
                  }}
                />
                <TextField
                  className='signup-input-email'
                  label='Email'
                  value={email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(event.target.value)
                  }}
                />
                <TextField
                  className='signup-input-password'
                  label='Password'
                  type='password'
                  value={password}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(event.target.value)
                  }}
                />
                <Button onClick={handleSignUp} variant='contained'>
                  Sign Up
                </Button>
              </ThemeProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Signup