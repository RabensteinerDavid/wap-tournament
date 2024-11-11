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
              borderColor: '#7b00ffc9'
            },
            '&:hover fieldset': {
              borderColor: '#7b00ffc9'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7b00ffc9'
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
          color: 'white',
          backgroundColor: '#7b00ffc9',
          '&:hover': {
            backgroundColor: '#7b00ff5a'
          }
        }
      }
    }
  }
})

export const themeHeader = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#7b00ff5a'
        }
      }
    }
  }
})
