import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import DeleteIcon from '@mui/icons-material/Delete'
import { DeleteModalProps } from '@g-loot/react-tournament-brackets'
import { deleteTournamentsByID } from '../../controller/tournamentController'

export default function DeleteModal ({
  tournament_title,
  tournament_id,
  handleDeleteMessage,
  openSnackbarDeleteMessage
}: DeleteModalProps) {
  const [open, setOpen] = useState(false)

  const handleModalOpen = () => {
    setOpen(true)
  }

  const handleModalClose = () => {
    setOpen(false)
  }

  const deleteTournament = async () => {
    const response = await deleteTournamentsByID(tournament_id)
    setOpen(false)
    openSnackbarDeleteMessage()
    handleDeleteMessage(response)
  }

  return (
    <>
      <Button
        component='label'
        variant='outlined'
        startIcon={<DeleteIcon />}
        onClick={handleModalOpen}
        color='error'
      >
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleModalClose}
        aria-labelledby='draggable-dialog-title'
        closeAfterTransition={false}
      >
        <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
          Are you sure you want to delete: <b>{tournament_title}</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You're will not be able to restore it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleModalClose}
            sx={{ color: '#7b00ff5a' }}
          >
            Cancel
          </Button>
          <Button onClick={deleteTournament} sx={{ color: '#7b00ffc9' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
