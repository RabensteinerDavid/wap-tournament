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
  Container,
  TextField,
  ThemeProvider,
  Snackbar,
  Alert,
  SnackbarCloseReason,
  Grid2 as Grid
} from '@mui/material'
import { pointsUpdateTournament } from '../style/Theme'
import axios from 'axios'
import Lottie from 'lottie-react'
import loadingAnimation from '../assets/loading.json'

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
  const [previousValue, setPreviousValue] = useState<string | null>(null)

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
    setPreviousValue(currentValue || '')
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
      const previousPoints = parseInt(previousValue || '0', 10)
      const pointsNew = points - previousPoints

      try {
        await changePointsParticipant(
          id,
          String(editing.groupIndex),
          String(editing.participantIndex),
          pointsNew
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

  const handleChange = (newPoints: string) => {
    setTempResult(newPoints)
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
          <Grid container spacing={4}>
            {groups.map((group, groupIndex) => (
              <Grid key={groupIndex} size={{ xs: 12, md: 6 }}>
                <Card className='group-card'>
                  <CardContent>
                    <Typography variant='h5' component='div' gutterBottom>
                      Group {groupIndex + 1}
                    </Typography>
                    {group.participants && group.participants.length > 0 && (
                      <>
                        {group.participants.map(
                          (
                            participant: Participant,
                            participantIndex: number
                          ) => (
                            <Grid
                              container
                              alignItems='center'
                              justifyContent='center'
                              key={participantIndex}
                              minHeight={40}
                            >
                              <Grid size={{ xs: 4, md: 6 }}>
                                <Typography variant='h6' align='center'>
                                  {typeof participant === 'string'
                                    ? participant
                                    : participant?.name ||
                                      'No participant name available'}
                                </Typography>
                              </Grid>
                              <Grid size={{ xs: 4, md: 6 }}>
                                {editing &&
                                editing.groupIndex === groupIndex &&
                                editing.participantIndex ===
                                  participantIndex ? (
                                  <TextField
                                    size='small'
                                    type='number'
                                    value={tempResult || ''}
                                    onChange={e => handleChange(e.target.value)}
                                    onBlur={handleBlur}
                                    autoFocus
                                    fullWidth
                                    slotProps={{
                                      htmlInput: {
                                        min: 0
                                      }
                                    }}
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
                                    group.results[participantIndex] !==
                                      undefined
                                      ? group.results[participantIndex]
                                      : ''}
                                  </Typography>
                                )}
                              </Grid>
                            </Grid>
                          )
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <div className='lottie-loading-wrapper'>
            <Lottie
              animationData={loadingAnimation}
              style={{ width: '40%' }}
              loop={true}
            />
          </div>
        )}
      </ThemeProvider>
    </Container>
  )
}
