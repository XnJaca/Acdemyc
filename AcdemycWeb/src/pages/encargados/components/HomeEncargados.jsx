import React from 'react'
import { Link } from 'react-router-dom'

export const HomeEncargados = () => {


  //Todo En los botones debe ser un map dependiendo de cuantos hijos tiene en esa escuela ese encargado
  //todo enviar el id para saber de que estudiante se esta hablando, aqui manejarlo de la mejor manera posible
  //todo para que pueda ser dinamico
  
  return (
    <div className='container'>
      <div className='d-flex flex-column align-items-center gap-2'>
        
        <Link to={`estudiante/${1}`}  className='btn btn-outline-secondary d-flex w-100 p-0 align-items-center justify-content-between'>
          <div className='d-flex align-items-center gap-4 justify-content-between'>
            <img
              // className='rounded-circle'
              width={100}
              src="https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png"
              alt="Usuario"
            />
            Nombre Estudiante
          </div>
          <i className="fa fa-solid fa-chevron-right mr-5 dNone460"></i>
        </Link>

        <Link to={`estudiante/${2}`} className='btn btn-outline-secondary d-flex w-100 p-0 align-items-center justify-content-between'>
          <div className='d-flex align-items-center gap-4 justify-content-between'>
            <img
              // className='rounded-circle'
              width={100}
              src="https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png"
              alt="Usuario"
            />
            Nombre Estudiante
          </div>
          <i className="fa fa-solid fa-chevron-right mr-5 dNone460"></i>
        </Link>

      </div>
    </div>
  )
}
