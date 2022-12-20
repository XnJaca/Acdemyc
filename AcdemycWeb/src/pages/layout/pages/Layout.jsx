import React from 'react'
import { Link, Navigate, Route, Routes, Outlet } from 'react-router-dom' 
import { SideBar, NavBar, EventModal } from '../../../components' 

export const Layout = () => {

  //? Idea base de la pagina principal
  //* 1. Mostrar el nombre del usuario
  //* 2. Mostrar el rol del usuario
  //* 3. Mostrar el menu de opciones
  //* 4. Dependiendo de que usuario sea se mostrara un menu u otro
  //* 5. Mostrar el menu de opciones

  //? Menu de Administrador

  //? Menu de Profesor

  //? Menu de Estudiante



  //! Cada vez que se cargue un componente hara que cargue un componente mientras se esta
  //! cargando losr achivos o se ejecuta el loading de la store


  return (
    // Menu de Administrador
    <div>

      <NavBar />

      <SideBar />

      {/* contenido base */}

      <div className="container">


        {
          //* Aqui lo que hacemos es cargar el componente de cargado cada vez
          //* que en la store este el loading en true o el mismo checking
          (false)
            ? <>
              <div>Cargando</div>
            </>
            :
            <> 
              <Outlet />
            </>
        }


      </div>

      <div className="footer">
        <div className="copyright">
          <p>Copyright &copy; 2022</p>
        </div>
      </div>

    </div>

  )
}
