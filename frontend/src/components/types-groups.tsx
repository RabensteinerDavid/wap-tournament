import {
    SVGViewer,
    CommonTreeProps,
    SingleEliminationProps,
} from '@g-loot/react-tournament-brackets'
import { useWindowSize } from '@uidotdev/usehooks'
import '../style/StyleElimination.css'
import { getTournamentGroups } from '../controller/tournamentController'
import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Grid } from '@mui/material';

export const GroupPhase: React.FC<SingleEliminationProps> = ({ id }) => {

    const size = useWindowSize();
    const finalWidth = (size.width ?? 0) * 2.5 / 3
    const finalHeight = (size.height ?? 0) * 2.5 / 3
    const [groups, setGroups] = useState<any[]>([]);

    useEffect(() => {
        if (!id) {
            console.error('Keine Turnier-ID vorhanden!');
            return;
        }

        const fetchTournaments = async () => {
            try {
                const data = await getTournamentGroups(id);
                setGroups(data);
                console.log(data[0].results[1]);
            } catch (err) {
                console.error('Fehler beim Laden des Turniers', err);
            }
        };
        fetchTournaments();
    }, [id]);

    return (
        <div className="groups-wrapper">
      {groups.length > 0 ? (
        <div>
          {groups.map((group, i) => (
            <Card className="group-card" key={i} sx={{ marginBottom: 2 }}>
              <CardContent>
                {/* Gruppentitel */}
                <Typography variant="h5" component="div" gutterBottom>
                  Group {i + 1}
                </Typography>

                {/* Teilnehmer anzeigen */}
                {group.participants && group.participants.length > 0 ? (
                  group.participants.map((participant: any, index: string | number) => (
                    <Grid container spacing={2} key={`${i}-${index}`} sx={{ marginBottom: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="body1">Participant: {participant || 'No participant name available'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Points: {group.results && group.results[index] != undefined ? group.results[index] : 'No points available'}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body1">No participants available in this group</Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    );
};