import React from 'react'
import { ExcelModal, ModalOpcionesRoles, NewDataModal, TablaDatos } from '../../../components'
import { useEffect, useState } from 'react'
import { MenuItem, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { useApiStore, useAuthStore } from '../../../hooks'
import { editTextFieldProps } from '../../../helpers';


export const ListaEstudiantesPage = () => {

  //! Los estudiantes necesitan materias a colocar o asignarles

  //! lo mejore es mandarlo y que escoja varias en otro modal, 
  //! O directamente 

  const [validationErrors, setValidationErrors] = useState({});
  const [modalAddData, setModalAddData] = useState(false);
  const [modalExcel, setModalExcel] = useState(false);

  const { onGetAllUser, onSaveUser, onGetDataValue, onEditUser, onEditData } = useApiStore();
  const { user } = useAuthStore();

  const saveEdits = async ({ exitEditingMode, row, values }) => {

    //* Evalua que los valores no esten vacios
    //* Como es un objeto lo lee con keys para evaluar la cantidad de datos existentes
    if (!Object.keys(validationErrors).length) {

      //? aqui limitamos los botones para que no puedan enviarlo dos veces
      //? o un peque;o gift al boton para saber que esta cargando
      //? o un toast para que sepa que esta cargando
      //? o desactivar los inputs para que no pueda editar nada 

      onEditUser({ url: `${'estudiantes/'}${row.original.id}`, dataEdit: values, tipo: "id" });

      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  //* Columnas para la tabla
  const columns = [
    {
      accessorKey: 'id', //access nested data with dot notation
      header: 'Id',
      size: 80,
      enableEditing: false,
      enableHiding: true,
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell, row }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
      })
    },
    {
      accessorKey: 'nombre', //access nested data with dot notation
      header: 'Nombre',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
      }),
    },
    {
      accessorKey: 'apellidos',
      header: 'Apellidos',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
      }),
    },
    {
      accessorKey: 'cedula',
      header: 'Cedula',
      type: 'number',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
        type: 'number',
      }),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
        type: 'email',
      }),
    },
    {
      accessorKey: 'celular',
      header: 'Celular',
      type: 'number',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
        type: 'number',
      }),
    },
  ];

  const onGetData = async () => {
    Promise.all([
      onGetAllUser({ url: 'estudiantes?estado=1', tipo: "estudiantes" }),

    ]).then((values) => {

    });
  }

  useEffect(() => {

    //* El primer cargado seria el de los administradores 
    onGetData();

  }, []);


  //* Columnas de prueba tiene los valoresa de la tabla pero con valores para agregar que no se muestran
  //* En la tabla pero si se guardan en la base de datos
  const columnsToAdd = [
    ...columns,
    {
      accessorKey: 'telefono',
      header: 'Telefono',
      type: 'text',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
      }),
    },
    {
      accessorKey: 'direccion',
      header: 'Direccion',
      type: 'text',
      multiline: true,
      maxRows: 3,
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
      }),
    },
    {
      accessorKey: 'clave',
      header: 'Clave',
      type: 'password',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
      }),
    },
    {
      accessorKey: 'fecha_nacimiento',
      header: 'Fecha Nacimiento',
      type: 'date',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
      }),
    },

  ];

  //Para crear un nuevo dato para la tabla
  const createNewData = (values) => {

    console.log("Agregando datos")

    //!editando datos de prueba porque todavia faltan los roles 
    values.fk_institucion = user.fk_institucion;
    values.tipo_usuario = 0;
    values.genero = "M";

    console.log("Data a enviar ", values)
    //onSaveUser({ url: '/estudainte', dataSave: values });
  };



  return (
    <div className='mt-3 mb-3 vh_100'>

      <h2 className='text-center'>Lista de Estudiantes</h2>
      <hr />
      <div className='d-flex justify-content-between mb-4'>
        <div className='d-flex gap-3'>

          {/* <TextField
            id="outlined-select-currency"
            className='ml-4'
            select
            name={"fk_rol_administrador"}
            defaultValue={''}
            label={"Rol de Administrador"}
            helperText="Seleccione el rol para mostrar"
            onChange={(e) => handleChangeSelect(e)}
          >
            <MenuItem value={"rol.id"}>
              Prueba
            </MenuItem>
            {/* {
              roles.map((rol) => {
                return (
                  <MenuItem key={rol.id} value={rol.id}>
                    {rol.descripcion}
                  </MenuItem>
                )
              })
            }  
          </TextField> */}

          {/* <button
            onClick={openModalOpciones}
            className='btn btn-outline-primary align-self-center'
          >
            Opciones</button> */}

        </div>

        <div className='d-flex h-100 align-self-center gap-3'>
          <button
            onClick={() => setModalExcel(true)}
            type="file" 
            className='btn btn-outline-secondary '
          >
            <img src="/icons/excelIcon.png" width={40} alt="Cargar Excel" />
          </button>

          <button
            onClick={() => setModalAddData(true)}
            className='btn btn-primary'
          >
            Agregar Estudiante
          </button>
        </div>

      </div>

      {/* 
      podemos enviar una url con los datos osea, enviarmos urlEditar, y urlObtener
      Dado caso que sean diferentes urls, si es la misma url lo dejamos asi   
      <TablaDatos urlEditar='usuarios/:ID' urlGetAll='usuarios'/>  
      */}

      <TablaDatos
        urlEdit={'estudiantes/'}
        columns={columns}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        typeEdit={'id'}
        handleSaveRowEdits={saveEdits}
      />

      <NewDataModal
        columns={columnsToAdd.slice(1)}
        modalOpen={modalAddData}
        onClose={() => setModalAddData(false)}
        onSubmit={createNewData}
        title={'Agregar Estudiante'}
      />

      <ExcelModal 
      modalOpen={modalExcel}
      onClose={() => setModalExcel(false)}
      title={'Cargar Excel'}
      />

      {/*
      <ModalOpcionesRoles
        modalOpen={modalAddOpciones}
        onClose={() => setModalAddOpciones(false)}
        title={'Opciones de Roles'}
        columns={columnsToRol}
        data={roles.slice(2)}
        setData={setRoles}
        onSubmit={handleCreateNewData}
        setValidationErrors={setValidationErrors}
        handleSaveRowEdits={EditsRols}
        handleDeleteRow={deleteRoles}
      /> */}

      

       

    </div>
  )
}
