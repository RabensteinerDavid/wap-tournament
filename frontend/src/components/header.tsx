import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  ThemeProvider
} from '@mui/material'
import { themeHeader } from '../style/Theme'
import { useAuth } from '../utils/auth'

const Header = () => {
  const { isLoggedIn, logout } = useAuth()
  return (
    <ThemeProvider theme={themeHeader}>
      <AppBar position='sticky'>
        <Toolbar>
          <Typography variant='h5' sx={{ flexGrow: 1 }}>
            Tournamentmaster
          </Typography>
          <Button color='inherit' component={Link} to='/home'>
            Home
          </Button>
          <Button color='inherit' component={Link} to='/view-tournaments'>
            All Tournaments
          </Button>
          {isLoggedIn && (
            <>
              <Button color='inherit' component={Link} to='/dashboard'>
                My tournaments
              </Button>
              <Button color='inherit' onClick={logout}>
                Logout
              </Button>
            </>
          )}
          {!isLoggedIn && (
            <Button color='inherit' component={Link} to='/signin'>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header