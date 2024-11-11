import { useNavigate } from 'react-router-dom'
import { isLoggedIn, logout } from '../controller/userController'
import { Button, ThemeProvider } from '@mui/material'
import { theme } from '../style/Theme'

const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/home')
  }

  return (
    <>
      {isLoggedIn() && (
        <>
          <p>You are already logged in</p>
          <div>
            <ThemeProvider theme={theme}>
              <Button onClick={handleLogout} variant='contained'>
                Logout
              </Button>
            </ThemeProvider>
          </div>
        </>
      )}
    </>
  )
}

export default Logout