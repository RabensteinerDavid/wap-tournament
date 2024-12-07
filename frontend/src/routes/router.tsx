import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom'
import Home from '../components/home'
import Signin from '../components/sign-in'
import Signup from '../components/sign-up'
import Layout from '../components/layout'
import Dashboard from '../components/dashboard'
import Protected from './protected'
import CreateTournament from '../components/create-tournament'
import EditTournament from '../components/edit-tournament'
import ViewTournament from '../components/view-tournament'
import ViewTournaments from '../components/view-tournaments'
import AccountActivation from '../components/account-activation'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route element={<Protected />}>
        {/* insert protected routes here */}
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/create-tournament' element={<CreateTournament />} />
        <Route path='/edit-tournament/:id' element={<EditTournament />} />
        {/* Example route for the preview of the elimnation pages */}
      </Route>
      <Route path='/view-tournament/:id' element={<ViewTournament />} />
      <Route path='/view-tournaments' element={<ViewTournaments />} />
      <Route path="/activate" element={<AccountActivation />} />
      <Route path='home' element={<Home />} />
      <Route path='signin' element={<Signin />} />
      <Route path='signup' element={<Signup />} />
      <Route path='*' element={<h1>Page not found</h1>} />
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true
    }
  }
)

export default router
