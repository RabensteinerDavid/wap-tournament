import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'

export default function DetailModal ({
  tournament_id,
}: { tournament_id: string }) {

  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/view-tournament/${tournament_id}`)
  }

  return (
    <Button
      variant="outlined"
      onClick={handleNavigate}
      color='success'
    >
      Details
    </Button>
  )
}