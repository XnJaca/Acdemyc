import React, { useEffect } from 'react'
import { TablaDatos } from '../../components'
import { useApiStore } from '../../hooks/useApiStore';

export const ProfesorPage = () => {

    const { onGetAll } = useApiStore();

    useEffect(() => {

        //El primer cargado seria el de los administradores
        onGetAll('usuarios');

    }, [])


    return (
        <div className='mt-3 mb-3 vh_100'>

            <h2>Administrar Usuarios</h2>
            <hr />
            <h3></h3>
            <div className='d-flex justify-content-between mb-4'>
                <div className='d-flex gap-3'>

                    <button
                        onClick={() => onGetAll('usuarios')}
                        className='btn btn-outline-secondary'
                    >
                        SuperAdministradores
                    </button>

                    <button
                        onClick={() => onGetAll('usuarios')}
                        className='btn btn-outline-secondary'
                    >
                        Coordinarores
                    </button>

                    <button
                        onClick={() => onGetAll('usuarios')}
                        className='btn btn-outline-secondary'
                    >
                        Auxiliar
                    </button>

                </div>

                <button
                    onClick={() => console.log("Abrir modal para agregar, agregar un comboBox para elegir el tipo de usuario ")}
                    className='btn btn-primary'
                >
                    Agregar Usuario Administrador
                </button>

            </div>
            <h4 className='btn-danger'>TODO: Configurar tabla</h4>

            {/* 
                podemos enviar una url con los datos osea, enviarmos urlEditar, y urlObtener
                Dado caso que sean diferentes urls, si es la misma url lo dejamos asi   
                <TablaDatos urlEditar='usuarios/:ID' urlGetAll='usuarios'/>  
            */}

            <TablaDatos />

        </div>
    )
}
