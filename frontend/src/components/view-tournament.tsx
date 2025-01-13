import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/View-Tournament.css';
import { SingleElimination } from './types-elimination';
import { GroupPhase } from './types-groups';
import { Fab } from '@mui/material'
import NavigationIcon from '@mui/icons-material/Navigation'
import { getTournament } from '../controller/tournamentController';

const ViewTournament = () => {
  const { id } = useParams();
  const [title, setTitle] = useState<string>();
  const [view, setView] = useState('elimination');
  const [groupPhase, setGroupPhaseDone] = useState<boolean>(false)

  useEffect(() => {

    const fetchTitle = async () => {
      try {
        const stringID = "" + id
        const response = await getTournament(stringID)
        const title = response.title;
        setGroupPhaseDone(response.isGroupPhaseDone)
        setTitle(title);
      } catch (err) {
        console.error('Fehler beim Laden der Namen:', err);
      }
    };
    fetchTitle();
  }, [id]);

  useEffect(() => {
    const isGroupPhaseDone = groupPhase ? "elimination" : "group"
    setView(isGroupPhaseDone)
  }, [groupPhase])

  const toggleView = () => {
    setView((prevView) => (prevView === 'elimination' ? 'group' : 'elimination'));
  };

  return (
    <div className="view-tournament-wrapper">
      <h1>{title || "Loading"}</h1>
      {view === 'elimination' ? (
        id ? (
          <SingleElimination id={id} reloadTrigger={0} />
        ) : (
          <p>Error: ID is required for Single Elimination.</p>
        )
      ) : (
        <GroupPhase id={id || 'default-group-id'} reloadTrigger={0} />
      )}
      <div className='floating-button'>
        <Fab
          onClick={toggleView}
          variant='extended'
          sx={{
            backgroundColor: '#7b00ff5a',
            color: 'white',
            "&:hover": {
              backgroundColor: "#7b00ffc9",
            },
          }}
        >
          <NavigationIcon sx={{ mr: 1 }} />
          {view === 'elimination'
            ? 'Show Group Phase'
            : 'Show Single Elimination'}
        </Fab>
      </div>
    </div>
  );
};

export default ViewTournament;
