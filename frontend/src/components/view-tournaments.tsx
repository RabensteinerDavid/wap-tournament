import { useParams } from 'react-router-dom';
import '../style/View-Tournaments.css'

const ViewTournaments = () => {

  const { id } = useParams();

  return (
    <div className='view-tournaments-wrapper'>
      <h1>View Tournaments {id}</h1>
      <p>This is the side to view all tournaments</p>
    </div>
  )
}

export default ViewTournaments