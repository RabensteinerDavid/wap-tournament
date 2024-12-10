import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './routes/router'
import { AuthProvider } from './utils/auth'
import { setRouter } from './controller/navigationController';

setRouter(router); 

function App () {
  return (
    <AuthProvider>
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true
        }}
      />
    </AuthProvider>
  )
}

export default App
