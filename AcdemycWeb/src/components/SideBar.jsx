import { Link, Navigate, Route, Routes } from 'react-router-dom'

export const SideBar = () => {
    return (
        <div>


            <div className="offcanvas offcanvas-start text-bg-light" tabIndex={-1} id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                <div className="offcanvas-header">
                    <div className='d-flex align-items-center'>
                        <img src="/500x500-bg-transparent.png" height="40" width="40" alt="Acdemyc" />
                        <h5 className="offcanvas-title ml-2 fs_1_2rem" id="offcanvasDarkNavbarLabel">Acdemyc</h5>
                    </div>
                    <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-center flex-grow-1">

                        <li data-bs-dismiss="offcanvas" className="nav-item hover_gray ">
                            <Link className='nav-link navbarItems' to='/'>
                                <div className='fs_1_2rem'>
                                    <i className="icon-home mr-2"></i>
                                    Inicio
                                </div> 
                                {/* <i class="fa fa-thin fa-chevron-right mr-1"></i> */}
                            </Link>  
                        </li>  
                        
                    </ul>
                </div>
            </div>
        </div>
    )
}
