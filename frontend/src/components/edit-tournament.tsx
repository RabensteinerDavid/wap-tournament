import { useParams } from 'react-router-dom';
import '../style/Edit-Tournament.css'

const EditTournament = () => {

  const { id } = useParams();

  return (
    <div className='edit-tournament-wrapper'>
      <h1>Edit Tournament {id}</h1>
      <p>This is the edit side for tournament</p>
    </div>
  )
}

export default EditTournament