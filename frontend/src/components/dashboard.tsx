import { useEffect, useState } from 'react'
import '../style/Dashboard.css'
import { getTournamentsByID } from '../controller/tournamentController'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Snackbar,
  SnackbarCloseReason,
  ThemeProvider
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { themeAccordion } from '../style/Theme'
import { parseISO, format } from 'date-fns'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import DeleteModal from './ui/delete-modal'
import { useAuth } from '../utils/auth'
import EditModal from './ui/edit-modal'
import FloatingButton from './ui/floating-button'
import { DeleteResponse } from '@g-loot/react-tournament-brackets'

const Dashboard = () => {
  const { getUser } = useAuth()
  const [tournaments, setTournaments] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const [success, setSucces] = useState(false)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const user = await getUser()
      const userID = user.data.id
      const data = await getTournamentsByID(userID)
      setTournaments(data)
    } catch (err) {
      console.error('Fehler beim Laden der Turniere:', err)
    }
  }

  const handleDeleteMessage = async (response: DeleteResponse) => {
    setMessage(response.message)
    setSucces(!response.error)
    fetchTournaments()
  }

  const openSnackbarDeleteMessage = () => {
    setOpen(true)
  }

  const closeDeleteMessage = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <div className='dashboard-wrapper'>
      <h1>Dashboard</h1>
      <Snackbar open={open} autoHideDuration={6000} onClose={closeDeleteMessage}>
        {success ? (
          <Alert
            onClose={closeDeleteMessage}
            sx={{ width: '100%', backgroundColor: '#7b00ff5a', color: 'white' }}
          >
            {message}
          </Alert>
        ) : (
          <Alert
            onClose={closeDeleteMessage}
            severity='error'
            sx={{ width: '100%', backgroundColor: '#FF0E00', color: 'white' }}
          >
            {message}
          </Alert>
        )}
      </Snackbar>
      <div className='tournaments'>
        <ThemeProvider theme={themeAccordion}>
          {tournaments
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((tournament, index) => (
              <Accordion key={index} className='tournament'>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                  id={`panel${index}-header`}
                >
                  <span className='dashboard-tournament-accordion'>
                    <div className='dashboard-tournament-title'>
                      <h3>{tournament.title}</h3>
                      {tournament.winner && (
                        <EmojiEventsIcon style={{ color: 'gold' }} />
                      )}
                    </div>
                    {format(parseISO(tournament.date), 'dd.MM.yyyy')}
                  </span>
                </AccordionSummary>
                <AccordionDetails>
                  <span className='dashboard-tournament-participants-wrapper'>
                    Participants:{' '}
                    <p className='dashboard-tournament-participants'>
                      {tournament.participants.join(', ')}
                    </p>
                  </span>
                </AccordionDetails>
                <AccordionActions>
                  <EditModal
                    tournament_title={tournament.title}
                    tournament_id={tournament._id}
                  />
                  <DeleteModal
                    tournament_title={tournament.title}
                    tournament_id={tournament._id}
                    handleDeleteMessage={handleDeleteMessage}
                    openSnackbarDeleteMessage={openSnackbarDeleteMessage}
                  />
                </AccordionActions>
              </Accordion>
            ))}
        </ThemeProvider>
      </div>
      <div className='floating-button-wrapper'>
        <FloatingButton />
      </div>
    </div>
  )
}

export default Dashboard
