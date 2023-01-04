import { useEffect, useState } from 'react'
import { MenuItem, TextField } from '@mui/material';
import Swal from 'sweetalert2';

import { editTextFieldProps } from '../../helpers';
import { useApiStore, useAuthStore } from '../../hooks'
import { NewDataModal, TablaDatos, ModalOpcionesRoles } from '../../components'
import acdemycApi from '../../api/acdemycApi';

export const AdminPage = () => {
  //* Donde se guardan los valores a mostrar 
  const [validationErrors, setValidationErrors] = useState({});
  const [modalAddData, setModalAddData] = useState(false)
  const [modalAddOpciones, setModalAddOpciones] = useState(false)

  const { onGetAllUser, onSaveUser, onGetDataValue, onEditUser, onEditData } = useApiStore();
  const [roles, setRoles] = useState([]);
  const { user } = useAuthStore();

  //! Datos de prueba
  const genero = [{ value: 'M', name: 'Masculino' }, { value: 'F', name: 'Femenino' }];

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
    {
      accessorKey: 'rol_administrador',
      header: 'Tipo Rol',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: {
        select: true, //change to select for a dropdown
        children: roles.slice(1).map((rol) => (
          <MenuItem key={rol.id} value={rol.descripcion}>
            {rol.descripcion}
          </MenuItem>
        )),
      },
    },
  ];

  //* Funcion para obtener el id del arreglo de roles
  const idRolAdministrador = (descripcionRol) => {
    return roles.find(rol => rol.descripcion === descripcionRol).id;
  }

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

  const onGetData = async () => {
    Promise.all([
      onGetDataValue({ url: 'roladministrador', tipo: 'rol_administrador' }),
      onGetAllUser({
        url: 'administrador',
        tipo: "administradores"
      }),
    ]).then((values) => {
      setRoles([{ id: 'TODOS', descripcion: 'TODOS' }, ...values[0] ]);
    });
  }

  //Para crear un nuevo dato para la tabla
  const handleCreateNewData = (values) => {

    console.log("Agregando datos")

    //!editando datos de prueba porque todavia faltan los roles 
    values.fk_institucion = user.fk_institucion;
    values.tipo_usuario = 0;
    values.genero = "M";

    values.fk_rol_administrador = idRolAdministrador(values.rol_administrador);
    delete values.rol_administrador;

    console.log("Data a enviar ", values)
    //onSaveUser({ url: '/administrador', dataSave: values });
  };

  //* Metodo para agregar nuevo rol, enviandole el header
  const AddNewRol = () => {
    Swal.fire({
      title: 'Digite el nombre del nuevo rol',
      input: 'text',
      inputPlaceholder: 'Nombre del rol',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {

        return acdemycApi.post('/roladministrador', { descripcion: login })
          .then(response => {
            if (response.status === 200) {
              return response.data;
            }
          })
          .catch(error => {
            console.log(error)
            Swal.showValidationMessage(
              `Request failed: ${error}`
            )
          })
      },
      allowOutsideClick: () => !Swal.isLoading(),
      backdrop: true
    }).then((result) => {

      if (result.isConfirmed) {
        console.log(result)

        setRoles([...roles, result.value.rol_administrador]);

        Swal.fire('Creado', 'Se creo correctamente el rol', 'success')
      }

    })
  }

  const handleChangeSelect = (e) => {
    //* si cuando cambia de valor el cvalue de ese valor es 'TODOS' entonces carga el total
    if (e.target.value !== 'TODOS') {
      onGetAllUser({
        url: 'administrador',
        tipo: "administradores",
        filter: { tipo: 'fk_rol_administrador', tipoSecondario: "", filter: e.target.value }
      });
    } else {
      onGetAllUser({
        url: 'administrador',
        tipo: "administradores"
      });
    } 
  }  

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {

    //* Evalua que los valores no esten vacios
    //* Como es un objeto lo lee con keys para evaluar la cantidad de datos existentes
    if (!Object.keys(validationErrors).length) {

      //? aqui limitamos los botones para que no puedan enviarlo dos veces
      //? o un peque;o gift al boton para saber que esta cargando
      //? o un toast para que sepa que esta cargando
      //? o desactivar los inputs para que no pueda editar nada

      values.fk_rol_administrador = idRolAdministrador(values.rol_administrador);
      delete values.rol_administrador;

      if (row.original.fk_rol_administrador === values.rol_administrador) {
        onEditUser({ url: `${'administrador/'}${row.original.id}`, dataEdit: values, tipo: "id", delete: true });
      } else {
        onEditUser({ url: `${'administrador/'}${row.original.id}`, dataEdit: values, tipo: "id" });
      }


      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const EditsRols = async ({ exitEditingMode, row, values }) => {

    //* Evalua que los valores no esten vacios
    //* Como es un objeto lo lee con keys para evaluar la cantidad de datos existentes
    if (!Object.keys(validationErrors).length) {

      console.log(row)

      exitEditingMode();

      await onEditData({ url: `roladministrador/${row.original.id}`, dataEdit: values });

      roles.splice(row.index, 1);
      setRoles([...roles, values]);

      Swal.fire('Actualizado', 'Se actualizo correctamente el rol', 'success');

    }
  };

  const openModalOpciones = () => {
    setModalAddOpciones(true);
  }

  const columnsToRol = [
    {
      accessorKey: 'id',
      header: 'ID',
      type: 'text',
      enableEditing: false,
      enableHiding: true,
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
      }),
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripcion',
      type: 'text',
      //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
      }),
    },
  ];

  const deleteRoles = (row) => {
    if (
      Swal.fire({
        title: 'Esta seguro?',
        text: "Una vez eliminado no se puede recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, eliminar!',
        preConfirm: async () => {
          return await acdemycApi.delete(`/roladministrador/${row.original.id}`)
            .then(response => {
              if (response.status === 200) {
                return response;
              }
            })
            .catch(error => {
              Swal.showValidationMessage(
                `Request failed: ${error}`
              );
            });
        },
        allowOutsideClick: () => !Swal.isLoading(),
        backdrop: true
      }).then(async (result) => {
        if (result.isConfirmed) {

          roles.splice(row.index, 1);
          setRoles([...roles]);

          Swal.fire(
            'Eliminado!',
            'Eliminado correctamente',
            'success'
          );
        }
      })
    ) {
      return;
    }
  };

  useEffect(() => {

    //* El primer cargado seria el de los administradores 
    onGetData();

  }, [])


  return (
    <div className='mt-3 mb-3 vh_100'>

      <h2 className='text-center'>Lista de Usuarios Administradores</h2>
      <hr />
      <div className='d-flex justify-content-between mb-4'>
        <div className='d-flex gap-3'>

          <TextField
            id="outlined-select-currency"
            className='ml-4'
            select
            name={"fk_rol_administrador"}
            defaultValue={''}
            label={"Rol de Administrador"}
            helperText="Seleccione el rol para mostrar"
            onChange={(e) => handleChangeSelect(e)}
          >
            {
              roles.map((rol) => {
                return (
                  <MenuItem key={rol.id} value={rol.id}>
                    {rol.descripcion}
                  </MenuItem>
                )
              })
            }
          </TextField>

          <button
            onClick={openModalOpciones}
            className='btn btn-outline-primary align-self-center'
          >
            Opciones</button>

        </div>

        <div className='d-flex h-100 align-self-center gap-3'>
          <button
            onClick={AddNewRol}
            className='btn btn-outline-secondary'
          >
            Agregar Rol
          </button>

          <button
            onClick={() => setModalAddData(true)}
            className='btn btn-primary'
          >
            Agregar Usuario Administrador
          </button>
        </div>

      </div>

      {/* 
        podemos enviar una url con los datos osea, enviarmos urlEditar, y urlObtener
        Dado caso que sean diferentes urls, si es la misma url lo dejamos asi   
        <TablaDatos urlEditar='usuarios/:ID' urlGetAll='usuarios'/>  
        */}

      <TablaDatos
        urlEdit={'administrador/'}
        columns={columns}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        typeEdit={'id'}
        handleSaveRowEdits={handleSaveRowEdits}
      />

      <NewDataModal
        columns={columnsToAdd.slice(1)}
        modalOpen={modalAddData}
        onClose={() => setModalAddData(false)}
        onSubmit={handleCreateNewData}
        title={'Agregar Administrador'}
      />

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
      />

    </div>
  )
} 