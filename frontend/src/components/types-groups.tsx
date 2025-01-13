import {
  Group,
  Participant,
  SingleEliminationProps
} from '@g-loot/react-tournament-brackets'
import '../style/StyleElimination.css'
import '../style/View-Group-Phase.css'
import { getTournamentGroups } from '../controller/tournamentController'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid2 as Grid,
  Container
} from '@mui/material'
import Lottie from 'lottie-react'
import loadingAnimation from '../assets/loading.json'

export const GroupPhase: React.FC<SingleEliminationProps> = ({ id }) => {
  const [groups, setGroups] = useState<Group[]>([])

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
  }, [id])

  return (
    <Container className='groups-wrapper'>
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
                              <Typography variant='body1'>
                                {group.results &&
                                group.results[participantIndex] !== undefined
                                  ? group.results[participantIndex]
                                  : ''}
                              </Typography>
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
    </Container>
  )
}
