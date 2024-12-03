import {
    SVGViewer,
    CommonTreeProps,
    SingleEliminationProps,
} from '@g-loot/react-tournament-brackets'
import { useWindowSize } from '@uidotdev/usehooks'
import '../style/StyleElimination.css'
import '../style/View-Group-Phase.css'
import { getTournamentGroups } from '../controller/tournamentController'
import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Grid, Container, TextField } from '@mui/material';
import api from '../service/axiosInstance'

export const GroupPhase: React.FC<SingleEliminationProps> = ({ id }) => {
    const size = useWindowSize();
    const finalWidth = (size.width ?? 0) * 2.5 / 3;
    const finalHeight = (size.height ?? 0) * 2.5 / 3;
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

    const updateGroupResults = async (tournamentId: string, groupId: string, results: any[]) => {
        try {
            await api.put(`/tournament/${tournamentId}/group/${groupId}`, { results });
            console.log('Results updated successfully');
        } catch (err) {
            console.error('Error updating results:', err);
        }
    };

    return (
        <Container className="groups-wrapper">
            {groups.length > 0 ? (
                <Grid container spacing={3}>
                    {groups.map((group, i) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                            <Card className="group-card" sx={{ marginBottom: 2 }}>
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
                                                    <Typography variant="h6">
                                                        {participant || 'No participant name available'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        type="number"
                                                        value={group.results && group.results[index] != undefined ? group.results[index] : ''}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value === '' ? '' : parseInt(e.target.value);
                                                            const updatedGroups = [...groups];
                                                            updatedGroups[i].results[index] = newValue;
                                                            setGroups(updatedGroups);
                                                        }}
                                                        onBlur={() => {
                                                            updateGroupResults(id ?? "0", group._id, group.results); // Änderungen speichern
                                                        }}
                                                        inputProps={{
                                                            min: 0,
                                                            inputMode: 'numeric',
                                                        }}
                                                    />

                                                </Grid>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Typography variant="body1">No participants available in this group</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <p>Loading...</p>
            )}
        </Container>
    );
};
