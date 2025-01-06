import {
  Group,
  Participant,
  SingleEliminationProps
} from '@g-loot/react-tournament-brackets'
import '../style/StyleElimination.css'
import '../style/View-Group-Phase.css'
import {
  changePointsParticipant,
  getTournamentGroups
} from '../controller/tournamentController'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  TextField,
  ThemeProvider,
  Snackbar,
  Alert,
  SnackbarCloseReason
} from '@mui/material'
import { pointsUpdateTournament } from '../style/Theme'
import axios from 'axios'

export const GroupPhaseEdit: React.FC<SingleEliminationProps> = ({
  id,
  reloadTrigger
}) => {
  const [groups, setGroups] = useState<Group[]>([])
  const [editing, setEditing] = useState<{
    groupIndex: number
    participantIndex: number
  } | null>(null)
  const [tempResult, setTempResult] = useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')

  useEffect(() => {
    if (!id) {
      console.error('Keine Turnier-ID vorhanden!')
      return
    }

    const fetchTournaments = async () => {
      try {
        const data = await getTournamentGroups(id)
        setGroups(data)
      } catch (err) {
        console.error('Fehler beim Laden des Turniers', err)
      }
    }
    fetchTournaments()
  }, [id, reloadTrigger])

  const handleDoubleClick = (
    groupIndex: number,
    participantIndex: number,
    currentValue: string
  ) => {
    setEditing({ groupIndex, participantIndex })
    setTempResult(currentValue || '')
  }

  const handleBlur = async () => {
    if (editing) {
      if (!tempResult || !/^\d+$/.test(tempResult)) {
        setSnackbarMessage('Invalid input: Please enter a valid number.')
        setSnackbarOpen(true)
        setTempResult(null)
        setEditing(null)
        return
      }

      const points = parseInt(tempResult || '0', 10)
      try {
        await changePointsParticipant(
          id,
          String(editing.groupIndex),
          String(editing.participantIndex),
          points
        )
        const updatedGroups = [...groups]
        updatedGroups[editing.groupIndex].results[editing.participantIndex] =
          tempResult || ''
        setGroups(updatedGroups)
        setEditing(null)
        setTempResult(null)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setSnackbarMessage(error.response.data.error)
        } else {
          setSnackbarMessage('An unexpected error occurred.')
        }
        setSnackbarOpen(true)
        setEditing(null)
        setTempResult(null)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempResult(e.target.value)
  }

  const closeSnackbar = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  return (
    <Container className='groups-wrapper'>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity='error'
          sx={{ width: '100%', backgroundColor: '#FF0E00', color: 'white' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <ThemeProvider theme={pointsUpdateTournament}>
        {groups.length > 0 ? (
          <Grid container spacing={3}>
            {groups.map((group, groupIndex) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={groupIndex}>
                <Card className='group-card' sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant='h5' component='div' gutterBottom>
                      Group {groupIndex + 1}
                    </Typography>
                    {group.participants && group.participants.length > 0 ? (
                      group.participants.map(
                        (
                          participant: Participant,
                          participantIndex: number
                        ) => (
                          <Grid
                            container
                            spacing={2}
                            key={`${groupIndex}-${participantIndex}`}
                            sx={{ marginBottom: 1 }}
                          >
                            <Grid item xs={6}>
                              <Typography variant='h6'>
                                {typeof participant === 'string'
                                  ? participant
                                  : participant?.name ||
                                    'No participant name available'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {editing &&
                              editing.groupIndex === groupIndex &&
                              editing.participantIndex === participantIndex ? (
                                <TextField
                                  value={tempResult || ''}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  autoFocus
                                />
                              ) : (
                                <Typography
                                  variant='body1'
                                  onDoubleClick={() =>
                                    handleDoubleClick(
                                      groupIndex,
                                      participantIndex,
                                      group.results[participantIndex]
                                    )
                                  }
                                >
                                  {group.results &&
                                  group.results[participantIndex] !== undefined
                                    ? group.results[participantIndex]
                                    : ''}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        )
                      )
                    ) : (
                      <Typography variant='body1'>
                        No participants available in this group
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <p></p>
        )}
      </ThemeProvider>
    </Container>
  )
}