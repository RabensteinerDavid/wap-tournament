import { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/View-Tournament.css';
import { SingleElimination } from './types-elimination';
import { GroupPhase } from './types-groups'; // Importiere die neue Komponente
import { Button } from '@mui/material'

const ViewTournament = () => {
  const { id } = useParams();
  const [view, setView] = useState('elimination'); // Zustand für die aktuelle Ansicht

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
