import { createTheme } from '@mui/material'

export const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: 'white'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white'
            },
            '&:hover fieldset': {
              borderColor: 'white'
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white'
            },
            '& input': {
              color: 'white'
            }
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'white',
          '&.Mui-focused': {
            color: 'white'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'black',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: '#e0e0e0'
          }
        }
      }
    }
  }
})