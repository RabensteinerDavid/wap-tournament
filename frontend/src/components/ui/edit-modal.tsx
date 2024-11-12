import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { EditModalProps } from '@g-loot/react-tournament-brackets'
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom'

export default function EditModal ({
  tournament_title,
  tournament_id,
}: EditModalProps) {

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleModalOpen = () => {
    setOpen(true)
  }

  const handleModalClose = () => {
    setOpen(false)
  }
  const handleEdit = async () => {
    navigate(`/edit-tournament/${tournament_id}`)
  }

  return (
    <>
      <Button
        component='label'
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={handleModalOpen}
        color='success'
      >
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleModalClose}
        aria-labelledby='draggable-dialog-title'
        closeAfterTransition={false}
      >
        <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
          Are you sure you want to edit: <b>{tournament_title}</b>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleModalClose} sx={{ color: '#7b00ff5a' }}>
            Cancel
          </Button>
          <Button onClick={handleEdit} sx={{ color: '#7b00ffc9' }}>
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
