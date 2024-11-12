import { useParams } from 'react-router-dom';
import '../style/View-Tournament.css'
import { SingleElimination } from './types-elimination';

const ViewTournament = () => {

  const { id } = useParams();

  return (
    <div className='view-tournament-wrapper'>
      <h1>View Tournament {id}</h1>
      <SingleElimination id={id}/>
    </div>
  )
}

export default ViewTournament