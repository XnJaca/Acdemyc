import { MenuItem } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { NewDataModal, TablaDatos } from '../../components'
import { validateAge, validateEmail, validateRequired } from '../../helpers';
import { useApiStore } from '../../hooks'

export const AdminPage = () => {
  //* Donde se guardan los valores a mostrar 
  const [validationErrors, setValidationErrors] = useState({});
  const [modalAddData, setModalAddData] = useState(false)

  //* Uso de las validaciones en cada columna y cuando se cree el edit de la tabla
  const editTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        //* El onBlur es un evento que sucede cuando el usuario sale de un input
        onBlur: (event) => {
          //* La celda es el valor actual del input, se selecciona por el id
          //* El id seria el nombre o la key de la base de datos
          const isValid =
            cell.column.id === 'Email'
              //* Esta funcion evalua si tiene los datos correctos para un correo
              ? validateEmail(event.target.value)
              : cell.column.id === 'age'
                //* Esta funcion evalua si la edad esta determinada de un rango a otro
                ? validateAge(event.target.value)
                //* Esta funcion evalua si esta vacia el target actual
                : validateRequired(event.target.value);
          if (!isValid) {
            //* Coloca el valor de la celda en el objeto de errores
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} Es requerido`,
            });
          } else {
            //* Remueve el valor del error si todo esta correcto
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

  const tipoAdministrador = ['Administrador', 'Usuario', 'Invitado'];
  
  //* Columnas para la tabla
  const columns = useMemo(() => [
    {
      accessorKey: 'ID', //access nested data with dot notation
      header: 'Id',
      enableEditing: false,
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps(cell),
      }),
    },
    {
      accessorKey: 'Nombre', //access nested data with dot notation
      header: 'Nombre',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps(cell),
      }),
    },
    {
      accessorKey: 'Apellido_1',
      header: 'Apellido 1',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps(cell),
      }),
    },
    {
      accessorKey: 'Apellido_2', //normal accessorKey
      header: 'Apellido 2',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps(cell),
      }),
    },
    {
      accessorKey: 'Email',
      header: 'Email',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps(cell),
        type: 'email',
      }),
    },
    {
      accessorKey: 'Telefono',
      header: 'Telefono',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps(cell),
        type: 'number',
      }),
    },
    {
      accessorKey: 'tipoAdministrador',
      header: 'Tipo',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: {
        select: true, //change to select for a dropdown
        children: tipoAdministrador.map((TipoAdministrador) => (
          <MenuItem key={TipoAdministrador} value={TipoAdministrador}>
            {TipoAdministrador}
          </MenuItem>
        )),
      },
    },

  ], [editTextFieldProps]);

  //* Columnas de prueba tiene los valoresa de la tabla pero con valores para agregar que no se muestran
  //* En la tabla pero si se guardan en la base de datos
  const columnsToAdd = useMemo(() => [  
    ...columns,
    {
      accessorKey: 'Contrasena',
      header: 'Contrasena',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps(cell),
        type: 'password',
      }),
    },

  ], [editTextFieldProps]);

  const { onGetAll } = useApiStore();

  useEffect(() => {

    //El primer cargado seria el de los administradores
    onGetAll('usuarios');

  }, [])

  //Para crear un nuevo dato para la tabla
  const handleCreateNewData = (values) => {
    console.log(values)
    console.log("Agregar datos")
    // tableData.push(values);
    // setTableData([...tableData]);
  };



  console.log('Render admin page')

  //TODO: Configurar la tabla para que solo se muestren las cosas necesarias

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
          onClick={() => setModalAddData(true)}
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

      <TablaDatos urlEdit={'usuarios/'} columns={columns} validationErrors={validationErrors} setValidationErrors={setValidationErrors} />

      <NewDataModal
        columns={columnsToAdd}
        modalOpen={modalAddData}
        onClose={() => setModalAddData(false)}
        onSubmit={handleCreateNewData}
      />

    </div>
  )
} 