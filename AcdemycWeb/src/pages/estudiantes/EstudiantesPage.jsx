import React from 'react'
import { Link } from 'react-router-dom'

export const EstudiantesPage = () => {


    const id = 1;

    //! Si un encargado pone en la ruta un id random le saldria otro estudiante, entonces
    //! cada vez que se obtenga el estudiatne por id que verifique el padre de familia
    //! sea el mismo, osea, esten sincronizados

    const btnEstudiante = [
        {
            to: `/cursos/${id}`,
            urlImageIcon: "/icons/librosEstante.png",
            title: "Cursos",
            subtitle: "Listado de cursos"
        },
        {
            to: `/cursos/${id}`,
            urlImageIcon: "/icons/profesorPizarra.png",
            title: "Profesores",
            subtitle: "Listado de Profesores"
        },
        {
            to: `/cursos/${id}`,
            urlImageIcon: "/icons/calendarioAusente.png",
            title: "Ausencias",
            subtitle: "Listado de Ausencias"
        },
        {
            to: `/eventos`,
            urlImageIcon: "/icons/calendario.png",
            title: "Eventos",
            subtitle: "Listado de Eventos"
        },
    ]

    //Todo: idea general puede ser que cuando le de al boton envie el id del estudiante y que cargue la data de ese estudiante en especifico

    return (
        <div>
            <div className=''>
                <div className='row'>

                    <div className="col ">
                        <Link to={`/cursos/${id}`} className="card gradient-1">
                            <div className="card-body">
                                <h3 className="card-title text-white"></h3>
                                <div className="d-inline-block">
                                    <h2 className="text-white">Cursos</h2>
                                    <p className="text-white mb-0">Listado de cursos</p>
                                </div>
                                <span className="float-right display-5 opacity-5"> <img
                                    // className='rounded-circle'
                                    width={100}
                                    // height={30}
                                    src={'/icons/librosEstante.png'}
                                    alt="Usuario"
                                    className='ml-3'
                                /></span>
                            </div>
                        </Link>
                    </div>

                    <div className="col ">
                        <Link to={`/cursos/${id}`} className="card gradient-3">
                            <div className="card-body">
                                <h3 className="card-title text-white"></h3>
                                <div className="d-inline-block">
                                    <h2 className="text-white">{'Profesores'}</h2>
                                    <p className="text-white mb-0">Listado de profesores</p>
                                </div>
                                <span className="float-right display-5 opacity-5"> <img
                                    // className='rounded-circle'
                                    width={100}
                                    // height={30}
                                    src={'/icons/profesorPizarra.png'}
                                    alt="Usuario"
                                    className='ml-3'
                                /></span>
                            </div>
                        </Link>
                    </div>

                </div>


                <div className='row'>



                    <div className="col ">
                        <Link to={`/cursos/${id}`} className="card gradient-2">
                            <div className="card-body">
                                <h3 className="card-title text-white"></h3>
                                <div className="d-inline-block">
                                    <h2 className="text-white">{'Asistencia'}</h2>
                                    <p className="text-white mb-0">Listado de Asistencia</p>
                                </div>
                                <span className="float-right display-5 opacity-5"> <img
                                    // className='rounded-circle'
                                    width={100}
                                    // height={30}
                                    src={'/icons/calendarioAusente.png'}
                                    alt="Usuario"
                                    className='ml-3'
                                /></span>
                            </div>
                        </Link>
                    </div>

                    <div className="col ">
                        <Link to={`/cursos/${id}`} className="card gradient-4">
                            <div className="card-body">
                                <h3 className="card-title text-white"></h3>
                                <div className="d-inline-block">
                                    <h2 className="text-white">{'Eventos'}</h2>
                                    <p className="text-white mb-0">Listado de Eventos</p>
                                </div>
                                <span className="float-right display-5 opacity-5"> <img
                                    // className='rounded-circle'
                                    width={100}
                                    // height={30}
                                    src={'/icons/calendario.png'}
                                    alt="Usuario"
                                    className='ml-3'
                                /></span>
                            </div>
                        </Link>
                    </div>


                </div>

            </div>

        </div>
    )
}
