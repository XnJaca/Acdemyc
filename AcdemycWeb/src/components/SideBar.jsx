import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '../hooks'

export const SideBar = () => {

    const { tipoUsuario } = useAuthStore();

    const rutasSidebar = [
        {
            to: '/',
            icon: 'fa-home',
            title: 'Inicio'
        },
        {
            to: 'profesores',
            icon: 'fa-users',
            title: 'Profesores'
        },
        {
            to: 'estudiantes',
            icon: 'fa-graduation-cap',
            title: 'Estudiantes'
        },
        {
            to: 'materias',
            icon: 'fa-book',
            title: 'Materias'
        }
    ]

    return (
        <div>


            <div className="offcanvas offcanvas-start text-bg-light" tabIndex={-1} id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                <div className="offcanvas-header">
                    <div className='d-flex align-items-center'>
                        <img src="/icons/500x500-bg-transparent.png" height="40" width="40" alt="Acdemyc" />
                        <h5 className="offcanvas-title ml-2 fs_1_2rem" id="offcanvasDarkNavbarLabel">Acdemyc</h5>
                    </div>
                    <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-center flex-grow-1">
                        {
                            tipoUsuario.rol_administrador === 'DIRECTOR' && (
                                <li data-bs-dismiss="offcanvas" className="nav-item hover_gray " >
                                    <Link className='nav-link navbarItems' to={'/admin'}>
                                        <div className='fs_1_2rem'>
                                            <i className={`fa fa-solid fa-lock mr-2`}></i>
                                            Administrador
                                        </div>
                                        {/* <i class="fa fa-thin fa-chevron-right mr-1"></i> */}
                                    </Link>
                                </li>
                            )
                        }

                        {
                            rutasSidebar.map((ruta, index) => (
                                <li data-bs-dismiss="offcanvas" className="nav-item hover_gray " key={index}>
                                    <Link className='nav-link navbarItems' to={ruta.to}>
                                        <div className='fs_1_2rem'>
                                            <i className={`fa fa-solid ${ruta.icon} mr-2`}></i>
                                            {ruta.title}
                                        </div>
                                        {/* <i class="fa fa-thin fa-chevron-right mr-1"></i> */}
                                    </Link>
                                </li>
                            ))
                        }

                    </ul>
                </div>
            </div>
        </div>
    )
}
