import { useEffect, useState } from 'react'
import '../style/View-Tournaments.css'
import { getAllTournaments } from '../controller/tournamentController'
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
import DetailModal from './ui/detail-modal'


const ViewTournaments = () => {
  const [tournaments, setTournaments] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const data = await getAllTournaments()
      setTournaments(data)
      setMessage('Turniere erfolgreich geladen!')
      setSuccess(true)
      setOpen(true)
    } catch (err) {
      console.error('Fehler beim Laden der Turniere:', err)
      setMessage('Fehler beim Laden der Turniere.')
      setSuccess(false)
      setOpen(true)
    }
  }

  const closeSnackbarMessage = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <div className='tournaments-wrapper'>
      <h1>All Tournaments</h1>
      <Snackbar open={open} autoHideDuration={6000} onClose={closeSnackbarMessage}>
        {success ? (
          <Alert
            onClose={closeSnackbarMessage}
            sx={{ width: '100%', backgroundColor: '#7b00ff5a', color: 'white' }}
          >
            {message}
          </Alert>
        ) : (
          <Alert
            onClose={closeSnackbarMessage}
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
                  <span className='tournaments-tournament-accordion'>
                    <div className='tournaments-tournament-title'>
                      <h3>{tournament.title}</h3>
                      {tournament.winner && (
                        <EmojiEventsIcon style={{ color: 'gold' }} />
                      )}
                    </div>
                    {format(parseISO(tournament.date), 'dd.MM.yyyy')}
                  </span>
                </AccordionSummary>
                <AccordionDetails>
                  <span className='tournaments-tournament-participants-wrapper'>
                    Participants:{' '}
                    <p className='tournaments-tournament-participants'>
                      {tournament.participants.slice(0, 6).join(', ')}
                      {tournament.participants.length > 6 && '...'}
                    </p>
                  </span>
                </AccordionDetails>
                <AccordionActions>
                  <DetailModal
                    tournament_id={tournament._id}
                  />
                </AccordionActions>
              </Accordion>
            ))}
        </ThemeProvider>
      </div>
    </div>
  )
}

export default ViewTournaments