import { Outlet } from 'react-router-dom'
import Header from './header'

const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout