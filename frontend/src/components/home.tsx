import LottieAnimation from './ui/lottie'
import '../style/Home.css'
import { Fab } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

const Home = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  return (
    <div className='home-wrapper'>
      <div className='home-wrapper-text'>
        <LottieAnimation />
        <h1>Welcome to the Ultimate Tournament Experience</h1>
        <p>
          With our platform, you can easily create, manage, and participate in
          tournaments. Customize your tournaments, add participants, set
          tournament dates, and navigate through different phases such as group
          stages and knockout rounds. Tracking results and adding points for
          each team is just as easy as editing tournament details or managing
          participants. Simply double-click to open an input field and make
          changes. Our user-friendly interface allows you to focus entirely on
          the competition while we take care of the rest.
        </p>
        <div className='button-wrapper'>
          <Fab
            onClick={() => {
              navigate('/view-tournaments')
            }}
            variant='extended'
            sx={{
              backgroundColor: '#7b00ff5a',
              color: 'white',
              '&:hover': {
                backgroundColor: '#7b00ffc9'
              }
            }}
          >
            Show all tournaments
          </Fab>
          {!isLoggedIn && (
            <Fab
              onClick={() => {
                navigate('/signin')
              }}
              variant='extended'
              sx={{
                backgroundColor: '#7b00ff5a',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#7b00ffc9'
                }
              }}
            >
              Login
            </Fab>
          )}
          {isLoggedIn && (
            <Fab
              onClick={() => {
                navigate('/create-tournament')
              }}
              variant='extended'
              sx={{
                backgroundColor: '#7b00ff5a',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#7b00ffc9'
                }
              }}
            >
              Create new tournament
            </Fab>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
