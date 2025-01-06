import { useEffect, useState } from 'react'
import '../style/View-Tournaments.css'
import { getAllTournaments } from '../controller/tournamentController'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  ThemeProvider
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { themeAccordion } from '../style/Theme'
import { parseISO, format } from 'date-fns'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import DetailModal from './ui/detail-modal'
import { Tournament } from '@g-loot/react-tournament-brackets'


const ViewTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [, setOpen] = useState(false)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const data = await getAllTournaments()
      setTournaments(data)
      setOpen(true)
    } catch (err) {
      console.error('Fehler beim Laden der Turniere:', err)
      setOpen(true)
    }
  }

  return (
    <div className='tournaments-wrapper'>
      <h1>All Tournaments</h1>
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