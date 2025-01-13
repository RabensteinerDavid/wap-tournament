import { useNavigate, useSearchParams } from 'react-router-dom'
import '../style/Account-activation.css'
import { useAuth } from '../utils/auth'
import { useState } from 'react'
import { Button, ThemeProvider } from '@mui/material'
import { theme } from '../style/Theme'

const AccountActivation = () => {
  const { accountActivation } = useAuth()
  const [searchParams] = useSearchParams()
  const activationToken = searchParams.get('ACTIVATIONTOKEN')
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const handleAccountActivation = async () => {
    if (activationToken) {
      const response = await accountActivation(activationToken.toString())
      if (response.success) {
        setError('Account activated.')
        navigate('/signin')
      } else {
        setError(
          response.message || 'An error occurred during account activation.'
        )
      }
    }
  }

  return (
    <div className='account-activation-wrapper'>
      <ThemeProvider theme={theme}>
        <h1>Activate Your Account</h1>
        <Button variant='contained' onClick={handleAccountActivation}>
          Activate Account
        </Button>
        {<p>{error}</p>}
        {activationToken ? (
          <p>Token: {activationToken}</p>
        ) : (
          <p>Invalid or missing activation token.</p>
        )}
      </ThemeProvider>
    </div>
  )
}

export default AccountActivation
