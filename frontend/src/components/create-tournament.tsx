import { ThemeProvider } from '@emotion/react'
import '../style/Create-Tournament.css'
import { theme, themeCreateTournament } from '../style/Theme'
import {
  Alert,
  Button,
  Snackbar,
  SnackbarCloseReason,
  TextField
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Dayjs } from 'dayjs'
import { createTournament } from '../controller/tournamentController'
import { useNavigate } from 'react-router-dom'

const defaultParticipants = [
  { id: 0, name: '' },
  { id: 1, name: '' },
  { id: 2, name: '' },
  { id: 3, name: '' },
  { id: 4, name: '' },
  { id: 5, name: '' },
  { id: 6, name: '' },
  { id: 7, name: '' }
]

const CreateTournament = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [participants, setParticipants] = useState(defaultParticipants)
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [error, setError] = useState<string>('')
  const [open, setOpen] = useState(false)
  const participantsListRef = useRef<HTMLDivElement | null>(null)
  const [previousParticipantsCount, setPreviousParticipantsCount] = useState(
    participants.length
  )
  const inputRefs = useRef<(HTMLElement | null)[]>([])

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date)
  }

  const handleAddParticipant = () => {
    const hasEmptyName = participants.some(
      participant => participant.name.trim() === ''
    )

    if (!hasEmptyName) {
      setParticipants(prevParticipants => [
        ...prevParticipants,
        { id: prevParticipants.length, name: '' }
      ])
      setPreviousParticipantsCount(participants.length)
    } else {
      setOpen(true)
      ;(
        inputRefs.current[participants.length - 1]?.childNodes[1]
          .childNodes[0] as HTMLElement
      )?.focus()
      setError('Participant names must not be empty.')
    }
  }

  const handleParticipantChange = (id: number, value: string) => {
    setParticipants(prevParticipants =>
      prevParticipants.map(participant =>
        participant.id === id ? { ...participant, name: value } : participant
      )
    )
  }

  const handleDeleteParticipant = (id: number) => {
    if (participants.length <= 8) {
      setError('At least 8 participants are required.')
      setOpen(true)
      return
    }
    setParticipants(prevParticipants => {
      const updatedParticipants = prevParticipants.filter(
        participant => participant.id !== id
      )
      return updatedParticipants.map((participant, index) => ({
        ...participant,
        id: index
      }))
    })
    setPreviousParticipantsCount(participants.length)
  }

  const getDateString = (date: Dayjs | null) => {
    return date ? date.toISOString() : ''
  }

  const createTournamentHandler = async () => {
    const tournament = {
      title: title,
      participants: participants.map(participant => participant.name),
      date: getDateString(selectedDate)
    }

    if (!tournament.title || !tournament.date) {
      setError('Title and date must not be empty.')
      setOpen(true)
      return
    }

    if (
      tournament.participants.filter(participant => participant !== '').length <
      8
    ) {
      setError('At least 8 participants are required.')
      setOpen(true)
      return
    }

    const participantNames = participants.map(participant => participant.name)
    const uniqueParticipants = new Set()
    const duplicateIndexes: number[] = []

    for (let i = 0; i < participantNames.length; i++) {
      const name = participantNames[i]
      if (uniqueParticipants.has(name)) {
        duplicateIndexes.push(i)
      } else {
        uniqueParticipants.add(name)
      }
    }

    if (duplicateIndexes.length > 0) {
      setError(`Participants must be unique. Please change the participant`)
      ;(
        inputRefs.current[duplicateIndexes[0]]?.childNodes[1]
          .childNodes[0] as HTMLElement
      )?.focus()
      setOpen(true)
      return
    }

    const response = await createTournament(tournament)
    if (!response.error) {
      setTitle('')
      setParticipants(defaultParticipants)
      setSelectedDate(null)
      navigate('/dashboard')
    } else {
      setOpen(true)
      setError(response.message)
    }
  }

  const closeMessage = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    index: number
  ) => {
    if (event.key === 'Enter') {
      if (participants[index].name === '') {
        setOpen(true)
        setError('Participant name must not be empty.')
        return
      }

      const nextEmptyIndex = participants.findIndex(
        (participant, idx) => idx > index && participant.name === ''
      )
      if (nextEmptyIndex !== -1) {
        ;(
          inputRefs.current[nextEmptyIndex]?.childNodes[1]
            .childNodes[0] as HTMLElement
        )?.focus()
      } else {
        handleAddParticipant()
      }
    }
  }

  useEffect(() => {
    if (participants.length > previousParticipantsCount) {
      if (participantsListRef.current) {
        participantsListRef.current.scrollTop =
          participantsListRef.current.scrollHeight
        ;(
          inputRefs.current[participants.length - 1]?.childNodes[1]
            .childNodes[0] as HTMLElement
        )?.focus()
      }
      setPreviousParticipantsCount(participants.length)
    }
  }, [participants])

  return (
    <div className='create-tournament-wrapper'>
      <h1>Create Tournament</h1>
      <Snackbar open={open} autoHideDuration={5000} onClose={closeMessage}>
        <Alert
          onClose={closeMessage}
          severity='error'
          sx={{ width: '100%', backgroundColor: '#FF0E00', color: 'white' }}
        >
          {error}
        </Alert>
      </Snackbar>
      <ThemeProvider theme={themeCreateTournament}>
        <div className='create-tournament-wrapper-input'>
          <div className='create-tournament-wrapper-title'>
            <div className='create-tournament-input-date'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: 'white'
                    }
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className='create-tournament-wrapper-title-input'>
              <TextField
                required
                className='create-tournament-input-title'
                label='Title'
                value={title}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setTitle(event.target.value)
                }}
              />
            </div>
          </div>
          <div ref={participantsListRef} className='create-tournament-list'>
            {participants.map((participant, index) => (
              <div key={index} className='participant-input'>
                <TextField
                  required
                  className='create-tournament-input-participant'
                  label={`Participant`}
                  ref={el => (inputRefs.current[index] = el)}
                  value={participant.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleParticipantChange(participant.id, event.target.value)
                  }}
                  onKeyDown={e => handleKeyDown(e, index)}
                />
                <Button
                  className='delete-tournament-button-participant'
                  variant='outlined'
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteParticipant(participant.id)}
                  color='error'
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <Button
            className='create-tournament-button'
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={handleAddParticipant}
            color='success'
          >
            Add Participant
          </Button>
          <ThemeProvider theme={theme}>
            <Button
              className='create-tournament-button'
              onClick={createTournamentHandler}
              color='success'
            >
              Add Tournament
            </Button>
          </ThemeProvider>
        </div>
      </ThemeProvider>
    </div>
  )
}

export default CreateTournament