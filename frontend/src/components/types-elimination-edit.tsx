import {
  SingleEliminationBracket,
  SVGViewer,
  CommonTreeProps,
  SingleEliminationProps,
  Participant,
  Match
} from '@g-loot/react-tournament-brackets'
import { useWindowSize } from '@uidotdev/usehooks'
import '../style/StyleElimination.css'
import {
  getTournamentBracket,
  resetWinnerBracket,
  setWinnerBracket
} from '../controller/tournamentController'
import { useCallback, useEffect, useState } from 'react'
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  ThemeProvider,
  Snackbar,
  Alert,
  SnackbarCloseReason
} from '@mui/material'
import { theme, themeCreateTournament } from '../style/Theme'
import loadingAnimation from '../assets/loading.json'
import Lottie from 'lottie-react'

export const SingleEliminationEdit: React.FC<SingleEliminationProps> = ({
  id,
  reloadTrigger
}) => {
  const size = useWindowSize()
  const finalWidth = ((size.width ?? 0) * 2.5) / 3
  const finalHeight = ((size.height ?? 0) * 2.5) / 3
  const [tournaments, setTournaments] = useState<Match[]>([])
  const [open, setOpen] = useState(false)
  const [reset, setReset] = useState(false)
  const [localReloadTrigger, setLocalReloadTrigger] = useState<number>(0)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [matchDetails, setMatchDetails] = useState<{
    matchID: string
    topPartyPoints: number
    bottomPartyPoints: number
    topPartyName: string
    bottomPartyName: string
    topPartyId: string
    bottomPartyId: string
    topWinner: boolean
    bottomWinner: boolean
  } | null>(null)

  const onMatchClickTest = (
    top: Participant,
    topName: string,
    bottom: Participant,
    bottomName: string,
    bottomId: string,
    topId: string,
    matchID: string,
    winnerTop: boolean,
    winnerBottom: boolean
  ): void => {
    setMatchDetails({
      matchID: matchID,
      topPartyPoints: top.resultText ? parseInt(top.resultText, 10) : 0,
      bottomPartyPoints: bottom.resultText
        ? parseInt(bottom.resultText, 10)
        : 0,
      topPartyName: topName,
      bottomPartyName: bottomName,
      bottomPartyId: bottomId,
      topPartyId: topId,
      topWinner: winnerTop,
      bottomWinner: winnerBottom
    })
  }

  const handleResetOpen = useCallback(() => {
    if (matchDetails) {
      if (matchDetails.topWinner || matchDetails.bottomWinner) {
        setReset(true)
        setOpen(false)
      } else {
        setOpen(true)
        setReset(false)
      }
    }
  }, [matchDetails])

  useEffect(() => {
    handleResetOpen()
  }, [matchDetails, handleResetOpen])

  const handleClose = () => setOpen(false)
  const handleCloseReset = () => setReset(false)

  const handlePointsChange = (
    participant: 'top' | 'bottom',
    newPoints: number
  ) => {
    if (matchDetails) {
      if (participant === 'top') {
        setMatchDetails({
          ...matchDetails,
          topPartyPoints: newPoints
        })
      } else {
        setMatchDetails({
          ...matchDetails,
          bottomPartyPoints: newPoints
        })
      }
    }
  }

  const handleSavePoints = async () => {
    if (matchDetails) {
      const winnerTopOrBottom =
        matchDetails.topPartyPoints > matchDetails.bottomPartyPoints
          ? 'top'
          : 'bottom'
      const winnerID =
        winnerTopOrBottom === 'top'
          ? matchDetails.topPartyId
          : matchDetails.bottomPartyId

      try {
        const response = await setWinnerBracket(
          id,
          matchDetails.matchID,
          winnerID,
          winnerTopOrBottom === 'top'
            ? matchDetails.topPartyPoints
            : matchDetails.bottomPartyPoints,
          winnerTopOrBottom === 'top'
            ? matchDetails.bottomPartyPoints
            : matchDetails.topPartyPoints
        )
        setMatchDetails(null)
        setOpen(false)
        setLocalReloadTrigger(prev => prev + 1)
        if (!response.success) {
          setSnackbarMessage(response.message?.toString() || '')
          setSnackbarOpen(true)
        }
      } catch (error) {
        console.error('Error saving points:', error)
      }
    }
  }

  const resetWinner = async () => {
    if (matchDetails) {
      try {
        const response = await resetWinnerBracket(id, matchDetails.matchID)
        setReset(false)
        setLocalReloadTrigger(prev => prev + 1)
        if (!response.success) {
          setSnackbarMessage(response.message?.toString() || '')
          setSnackbarOpen(true)
        }
      } catch (error) {
        console.error('Error saving points:', error)
      }
    }
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

  useEffect(() => {
    if (!id) {
      console.error('Keine Turnier-ID vorhanden!')
      return
    }

    const fetchTournaments = async () => {
      try {
        const data = await getTournamentBracket(id)
        setTournaments(data)
      } catch (err) {
        console.error('Fehler beim Laden der Turniere:', err)
      }
    }
    fetchTournaments()
  }, [id, reloadTrigger, localReloadTrigger])

  return (
    <div className='elimination-wrapper'>
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: '#242424',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Update Match Points
          </Typography>
          <br />
          <ThemeProvider theme={themeCreateTournament}>
            <TextField
              label={`Points of ${matchDetails?.topPartyName}`}
              type='number'
              value={matchDetails?.topPartyPoints}
              onChange={e =>
                handlePointsChange('top', parseInt(e.target.value, 10))
              }
              fullWidth
              sx={{ marginBottom: 2 }}
              slotProps={{
                htmlInput: {
                  min: 0
                }
              }}
            />

            <TextField
              label={`Points of ${matchDetails?.bottomPartyName}`}
              type='number'
              value={matchDetails?.bottomPartyPoints}
              onChange={e =>
                handlePointsChange('bottom', parseInt(e.target.value, 10))
              }
              fullWidth
              sx={{ marginBottom: 2 }}
              slotProps={{
                htmlInput: {
                  min: 0
                }
              }}
            />
          </ThemeProvider>
          <ThemeProvider theme={theme}>
            <Button
              className='create-tournament-button'
              onClick={handleSavePoints}
              color='success'
            >
              Save Winner
            </Button>
          </ThemeProvider>
        </Box>
      </Modal>

      <Modal
        open={reset}
        onClose={handleCloseReset}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: '#242424',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Reset the bracket's winner
          </Typography>
          <ThemeProvider theme={theme}>
            <Button
              className='create-tournament-button'
              onClick={resetWinner}
              color='success'
            >
              Reset
            </Button>
          </ThemeProvider>
        </Box>
      </Modal>

      {tournaments.length > 0 ? (
        <SingleEliminationBracket
          matches={tournaments}
          matchComponent={props => (
            <div className='bracket-match'>
              <div
                className='top-party'
                onClick={() => {
                  if (
                    props.topParty &&
                    props.bottomParty &&
                    props.bottomParty.id
                  ) {
                    onMatchClickTest(
                      props.topParty,
                      props.topParty.name || '',
                      props.bottomParty,
                      props.bottomParty.name || '',
                      props.bottomParty.id.toString(),
                      props.topParty.id.toString(),
                      props.match.id.toString(),
                      props.topParty.isWinner ?? false,
                      props.bottomParty.isWinner ?? false
                    )
                  } else {
                    setSnackbarMessage(
                      'The bracket before must have a winner to change points'
                    )
                    setSnackbarOpen(true)
                  }
                }}
              >
                <div className='party-name'>
                  {props.topParty.name || props.teamNameFallback}
                </div>
                <div className='party-count'>
                  {props.topParty.resultText ??
                    props.resultFallback(props.topParty)}
                </div>
              </div>
              <div className='middle-party' />
              <div
                onClick={() => {
                  if (
                    props.topParty &&
                    props.bottomParty &&
                    props.bottomParty.id
                  ) {
                    onMatchClickTest(
                      props.topParty,
                      props.topParty.name || '',
                      props.bottomParty,
                      props.bottomParty.name || '',
                      props.bottomParty.id.toString(),
                      props.topParty.id.toString(),
                      props.match.id.toString(),
                      props.topParty.isWinner ?? false,
                      props.bottomParty.isWinner ?? false
                    )
                  } else {
                    setSnackbarMessage(
                      'The bracket before must have a winner to change points'
                    )
                    setSnackbarOpen(true)
                  }
                }}
                className='bottom-party'
              >
                <div className='party-name'>
                  {props.bottomParty.name || props.teamNameFallback}
                </div>
                <div className='party-count'>
                  {props.bottomParty.resultText ??
                    props.resultFallback(props.bottomParty)}
                </div>
              </div>
            </div>
          )}
          svgWrapper={({ children, ...props }: CommonTreeProps) => (
            <SVGViewer
              width={finalWidth}
              height={finalHeight}
              bracketWidth={finalWidth}
              bracketHeight={finalHeight}
              startAt={[0, 0]}
              scaleFactor={1}
              {...props}
            >
              {children}
            </SVGViewer>
          )}
        />
      ) : (
        <div className='lottie-loading-wrapper'>
          <Lottie
            animationData={loadingAnimation}
            style={{ width: '40%' }}
            loop={true}
          />
        </div>
      )}
    </div>
  )
}
