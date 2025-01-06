import { useParams } from 'react-router-dom'
import '../style/Edit-Tournament.css'
import { useEffect, useState } from 'react'
import {
  finishGroupPhase,
  getTournament,
  updateTournament
} from '../controller/tournamentController'
import { SingleElimination } from './types-elimination'
import { GroupPhaseEdit } from './types-groups-edit'
import {
  Fab,
  SwipeableDrawer,
  Box,
  Typography,
  TextField,
  ThemeProvider
} from '@mui/material'
import NavigationIcon from '@mui/icons-material/Navigation'
import { themeUpdateTournament } from '../style/Theme'
import EditIcon from '@mui/icons-material/Edit'

const EditTournament = () => {
  const { id } = useParams()
  const [title, setTitle] = useState<string | undefined>()
  const [participants, setParticipants] = useState<string[]>([])
  const [isOpen, setOpen] = useState<boolean>(false)
  const [view, setView] = useState<'elimination' | 'group'>('group')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [reloadTrigger, setReloadTrigger] = useState<number>(0)
  const [errorGroupPhase, setErrorGroupPhase] = useState<string | null>(null)

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        if (!id) return
        const response = await getTournament(id)
        setTitle(response.title)
        setParticipants(response.participants || [])
      } catch (err) {
        console.error('Error loading tournament data:', err)
      }
    }
    fetchTournamentData()
  }, [id])

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open)
  }

  const toggleView = () => {
    setView(prevView => (prevView === 'elimination' ? 'group' : 'elimination'))
  }

  const handleDoubleClick = (index: number) => {
    setEditingIndex(index)
  }
  const handleGroupPhase = async () => {
    const response = await finishGroupPhase(id)
    setReloadTrigger(prev => prev + 1)
    if (!response.success) {
      setErrorGroupPhase(response.message ?? 'An unexpected error occurred')
    }
  }

  const handleBlur = async (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedParticipants = [...participants]
    const newName = event.target.value.trim()
  
    // Check for duplicate names
    const isDuplicate = updatedParticipants.some(
      (participant, idx) => participant === newName && idx !== index
    )
  
    if (isDuplicate) {
      setErrorGroupPhase(`Der Name "${newName}" ist bereits vergeben.`)
      return
    }
  
    // Update participant name
    updatedParticipants[index] = newName
    setParticipants(updatedParticipants)
    setEditingIndex(null)
    setErrorGroupPhase(null)
  
    try {
      if (id && title) {
        const currentDate = new Date().toISOString()
        await updateTournament(id, title, updatedParticipants, currentDate)
        setReloadTrigger(prev => prev + 1)
      } else {
        console.error('ID or title is undefined')
      }
    } catch (err) {
      console.error('Error updating participants:', err)
    }
  }

  const participantsList = () => (
    <Box
      sx={{
        width: 350,
        padding: 2
      }}
      role='presentation'
    >
      <Typography
        variant='h6'
        component='div'
        sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
      >
        Edit Participants
      </Typography>
      <Typography
        component='div'
        sx={{ mb: 2, fontSize: '0.875rem', color: 'gray', textAlign: 'center' }}
      >
        If you change the names of the participants the points of the tournament
        get reseted
      </Typography>

      {participants.map((participant, index) => (
        <Box
          key={index}
          sx={{
            mb: 1,
            borderBottom: '1px solid var(--main-color)',
            paddingBottom: 1
          }}
        >
          {editingIndex === index ? (
            <ThemeProvider theme={themeUpdateTournament}>
              <TextField
                required
                defaultValue={participant}
                onBlur={event => handleBlur(event, index)}
                fullWidth
                autoFocus
              />
            </ThemeProvider>
          ) : (
            <Typography
              sx={{ cursor: 'pointer' }}
              onDoubleClick={() => handleDoubleClick(index)}
            >
              {participant}
            </Typography>
          )}
        </Box>
      ))}
      <div className='finish-group-phase-button'>
        {errorGroupPhase && (
          <Typography sx={{ color: 'red' }}>
            {errorGroupPhase}
          </Typography>
        )}
        <Fab
          onClick={handleGroupPhase}
          variant='extended'
          sx={{
            backgroundColor: '#7b00ff5a',
            color: 'white',
            '&:hover': {
              backgroundColor: '#7b00ffc9'
            }
          }}
        >
          Finish group phase
        </Fab>
      </div>
    </Box>
  )

  return (
    <div className='edit-tournament-wrapper'>
      <h1>
        {title || 'No tournament found with this id'}{' '}
        {title && (
          <EditIcon className='edit-button' onClick={toggleDrawer(true)}>
            Open Sidebar
          </EditIcon>
        )}
      </h1>
      <Typography
        component='div'
        sx={{ mb: 2, fontSize: '0.875rem', color: 'gray', textAlign: 'center' }}
      >
        The group phase has to be finished before elimination bracket can begin.
      </Typography>

      {/* ID-Prüfung */}
      {!id ? (
        <div>Fehler: Keine gültige ID gefunden.</div>
      ) : (
        <>
          {/* Dynamische Anzeige basierend auf `view` */}
          {view === 'elimination' ? (
            <SingleElimination id={id} reloadTrigger={reloadTrigger} />
          ) : (
            <GroupPhaseEdit id={id} reloadTrigger={reloadTrigger} />
          )}
        </>
      )}

      <SwipeableDrawer
        anchor='right'
        open={isOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          sx: {
            backgroundColor: '#242424',
            color: 'white'
          }
        }}
      >
        {participantsList()}
      </SwipeableDrawer>

      {title && (
        <div className='floating-button'>
          <Fab
            onClick={toggleView}
            variant='extended'
            sx={{
              backgroundColor: '#7b00ff5a',
              color: 'white',
              '&:hover': {
                backgroundColor: '#7b00ffc9'
              }
            }}
          >
            <NavigationIcon sx={{ mr: 1 }} />
            {view === 'elimination'
              ? 'Switch to Group Phase'
              : 'Switch to Single Elimination'}
          </Fab>
        </div>
      )}
    </div>
  )
}

export default EditTournament