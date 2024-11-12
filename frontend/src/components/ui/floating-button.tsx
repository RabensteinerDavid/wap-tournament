import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom'; 

export default function FloatingButton() {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate('/create-tournament'); 
  };

  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Fab aria-label="add" onClick={handleClick}> 
        <AddIcon />
      </Fab>
    </Box>
  );
}
