import React, { useEffect, useState } from 'react'
import acdemycApi from '../../api/acdemycApi'
import { ExampleWithReactQueryProvider } from '../../components'

export const AdminPage = () => {

  const [data, setdata] = useState([])

  const datos = async () => {
    try {
      await acdemycApi.get('usuarios').then(val => setdata(val.data.users));
    } catch (error) {
      console.log(error)
    }
    return false;
  }
  useEffect(() => {
    datos();
  }, [])
  const columns = [
    {
      accessorKey: 'Nombre', //access nested data with dot notation
      header: 'Nombre',
    },
    {
      accessorKey: 'Apellido_1',
      header: 'Apellido 1',
    },
    {
      accessorKey: 'Apellido_2', //normal accessorKey
      header: 'Apellido 2',
    },
    {
      accessorKey: 'Email',
      header: 'Email',
    },
    {
      accessorKey: 'Telefono',
      header: 'Telefono',
    },
  ];

  //TODO: Configurar la tabla para que solo se muestren las cosas necesarias

  return (
    <div className='mt-3 mb-3'>

      <h1>Admin Page</h1> 
      <hr />
      <h3>TODO: Configurar tabla</h3> 
      {/* <TablaDatos columns={columns} data={data} /> */}
      <ExampleWithReactQueryProvider/>
    </div>
  )
}
