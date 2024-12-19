import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/View-Tournament.css';
import { SingleElimination } from './types-elimination';
import { GroupPhase } from './types-groups'; // Importiere die neue Komponente
import { Button } from '@mui/material'
import { getTournamentsByID } from '../controller/tournamentController';

const ViewTournament = () => {
  const { id } = useParams();
  const [title, setTitle] = useState();
  const [view, setView] = useState('elimination'); // Zustand für die aktuelle Ansicht

  useEffect(() => {


    const fetchTitle = async () => {
      try {
        console.log("agsdkgasidtasidzt")
        const idString = "" + id;
        console.log(id)
        const data = await getTournament(idString);
        console.log(data);
        //setTitle(data);
      } catch (err) {
        console.error('Fehler beim Laden der Namen:', err);
      }
    };
    fetchTitle();
  }, [id]);

  const toggleView = () => {
    setView((prevView) => (prevView === 'elimination' ? 'group' : 'elimination'));
  };

  return (
    <div className="view-tournament-wrapper">
      <h1>View Tournament {id}</h1>
      <Button onClick={toggleView} className="toggle-view-button" variant='outlined' color='inherit'>
        {view === 'elimination' ? 'Switch to Group Phase' : 'Switch to Single Elimination'}
      </Button>
      {view === 'elimination' ? (
        <SingleElimination id={id} />
      ) : (
        <GroupPhase id={id} />
      )}
    </div>
  );
};

export default ViewTournament;
