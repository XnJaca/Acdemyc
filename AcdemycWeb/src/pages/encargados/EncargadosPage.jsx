
import { Outlet } from 'react-router-dom';
import { Footer } from '../../components';
import { NavBar, SideBar } from './components';

export const EncargadosPage = () => {
  return (
    <>
      <NavBar />

      <SideBar />

      <div className="container mt-3 vh_80">

        <Outlet />

      </div>

      <div>
        <Footer />
      </div>

    </>
  )
}
