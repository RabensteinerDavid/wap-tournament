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
              borderColor: '#5F00C5'
            },
            '&:hover fieldset': {
              borderColor: '#5F00C5'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5F00C5'
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
          backgroundColor: '#5F00C5',
          '&:hover': {
            backgroundColor: '#5F00C5'
          }
        }
      }
    }
  }
})

export const themeCreateTournament = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: 'white'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#5F00C5'
            },
            '&:hover fieldset': {
              borderColor: '#5F00C5'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5F00C5'
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
    }
  }
})

export const themeUpdateTournament = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'var(--main-color)'
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--main-color)'
            }
          }
        }
      }
    }
  }
})

export const pointsUpdateTournament = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
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
    }
  }
})

export const themeHeader = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#5F00C5'
        }
      }
    }
  }
})

export const themeAccordion = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          color: 'white'
        }
      }
    }
  }
})
