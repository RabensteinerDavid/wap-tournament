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
  setWinnerBracket
} from '../controller/tournamentController'
import { useEffect, useState } from 'react'
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  ThemeProvider
} from '@mui/material'
import { theme, themeCreateTournament } from '../style/Theme'

export const SingleElimination: React.FC<SingleEliminationProps> = ({
  id,
  reloadTrigger
}) => {
  const size = useWindowSize()
  const finalWidth = ((size.width ?? 0) * 2.5) / 3
  const finalHeight = ((size.height ?? 0) * 2.5) / 3
  const [tournaments, setTournaments] = useState<Match[]>([])
  const [open, setOpen] = useState(false)
  const [localReloadTrigger, setLocalReloadTrigger] = useState<number>(0)
  const [matchDetails, setMatchDetails] = useState<{
    matchID: string
    topPartyPoints: number
    bottomPartyPoints: number
    topPartyName: string
    bottomPartyName: string
    topPartyId: string
    bottomPartyId: string
  } | null>(null)

  const onMatchClickTest = (
    top: Participant,
    topName: string,
    bottom: Participant,
    bottomName: string,
    bottomId: string,
    topId: string,
    matchID: string
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
      topPartyId: topId
    })
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

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
        await setWinnerBracket(
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
      } catch (error) {
        console.error('Error saving points:', error)
      }
    }
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
      {/* Modal for changing points */}
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
              value={matchDetails?.topPartyPoints || ''}
              onChange={e =>
                handlePointsChange('top', parseInt(e.target.value, 10))
              }
              fullWidth
              sx={{ marginBottom: 2 }}
            />

            <TextField
              label={`Points of ${matchDetails?.bottomPartyName}`}
              type='number'
              value={matchDetails?.bottomPartyPoints || ''}
              onChange={e =>
                handlePointsChange('bottom', parseInt(e.target.value, 10))
              }
              fullWidth
              sx={{ marginBottom: 2 }}
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

      {tournaments.length > 0 ? (
        <SingleEliminationBracket
          matches={tournaments}
          matchComponent={props => (
            <div className='bracket-match'>
              <div
                className='top-party'
                onClick={() =>
                  onMatchClickTest(
                    props.topParty,
                    props.topParty.name || '',
                    props.bottomParty,
                    props.bottomParty.name || '',
                    props.bottomParty.id.toString(),
                    props.topParty.id.toString(),
                    props.match.id.toString()
                  )
                }
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
                onClick={() =>
                  onMatchClickTest(
                    props.topParty,
                    props.topParty.name || '',
                    props.bottomParty,
                    props.bottomParty.name || '',
                    props.bottomParty.id.toString(),
                    props.topParty.id.toString(),
                    props.match.id.toString()
                  )
                }
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
        // <div className='loading'>No tournament found...</div>
        <div className='loading'></div>
      )}
    </div>
  )
}