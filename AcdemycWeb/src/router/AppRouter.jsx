import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '../hooks/';
import { LoginPage, ChangePasswordPage, HomePage, AdminPage,Layout, PerfilPage } from '../pages';


export const AppRouter = () => {

    const { status, checkAuthToken } = useAuthStore()

    //* Se verifica si tiene token valido si no hay token se cierra la sesion
    useEffect(() => {
        checkAuthToken();
    }, [])

    if (status === 'checking') {
        return (
            <h3>Cargando....</h3>
        )
    }


    return (
        <Routes>
            {
                (status === 'firstLogin')
                    ?
                    <>
                        <Route path='/login/*' element={<ChangePasswordPage />} />
                        <Route path='/login/*' element={<Navigate to='/changePassword' />} />
                    </>
                    :
                    (status === 'not-authenticated')
                        ? (
                            <>
                                {/* <Route path='/auth/register' element={<LoginPage />} /> */}
                                <Route path='/login' element={<LoginPage />} />
                                <Route path='/*' element={<Navigate to='/login' />} />
                            </>
                        )
                        : (
                            <>
                                {/* Esto lo llevara a la pagina principal */}  
                                <Route path='/*' element={<Navigate replace to='/' />} /> 

                                {/* Aqui los hijos o lo que va dentro de la ruta principal
                                son los componentes que se van a mostrar en la pagina principal
                                se colocan como Outlet */}
                                <Route path='/' element={<Layout />}>
                                    <Route index element={<HomePage />} />
                                    <Route path='perfil' element={<PerfilPage />} />
                                    <Route path='admin' element={<AdminPage />} />
                                </Route>
                            </>
                        )
            }


        </Routes>

    )
}
