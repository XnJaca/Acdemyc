import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../hooks'

export const NavBar = () => {

    const { user, startLogout } = useAuthStore();

    return ( 
        <div className="header ml-0">
            <div className="header-content clearfix">

                <div className="nav-control">
                    <div className="hamburger">
                        <span className="toggle-icon">
                            <button className="toggle-icon btn hover_btnMenu" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
                                <i className="icon-menu"></i>
                            </button>
                        </span>
                    </div>
                </div>

                <div className="header-left">
                    <div className="input-group icons ml-2">
                        <Link to='/' className='d-flex'>
                            <img src="https://i.ytimg.com/vi/3TmYBWOKtLo/maxresdefault.jpg" height="40" width="40" alt="Acdemyc" />
                            <h2 className='acdemy_h1 ml-2 mb-0'>ACDEMYC</h2>
                        </Link>
                    </div>
                </div>

                <div className="header-right d-flex align-items-center">
                    <h3 className='mr-2'>{user.nombre}</h3>
                    <ul className="clearfix">

                        <li className="nav-item icons dropdown">
                            <a className="user-img c-pointer position-relative" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span className="activity active"></span>
                                <img src={'https://i.ytimg.com/vi/3TmYBWOKtLo/maxresdefault.jpg'} height="40" width="40" alt="" />
                            </a>
                            <div className='drop-down dropdown-profile dropdown-menu'>
                                <div className='dropdown-content-body'>
                                    <ul className="">
                                        <li>
                                            <Link to='/perfil'><i className="icon-user"></i> <span>Perfil</span></Link>
                                        </li>
                                        <li>
                                            <Link to='/configuracion'><i className="icon-lock"></i> <span>Configuracion</span></Link>
                                        </li>
                                        <li><Link to={'/login'} onClick={() => startLogout()}><i className="icon-key"></i> <span>Salir</span></Link></li>
                                    </ul>
                                </div>
                            </div>

                        </li>
                    </ul>
                </div>

            </div>
        </div>

    )
}
