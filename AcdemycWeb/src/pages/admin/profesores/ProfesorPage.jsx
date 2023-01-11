import React, { useEffect, useState } from 'react'
import { NewDataModal, TablaDatos } from '../../../components'
import { MenuItem, TextField } from '@mui/material';
import { editTextFieldProps } from '../../../helpers';
import { useApiStore, useAuthStore } from '../../../hooks'
import Swal from 'sweetalert2';
import { format, parseISO } from 'date-fns';

export const ProfesorPage = () => {

    const [validationErrors, setValidationErrors] = useState({});
    const { onGetAllUser, onSaveUser,onEditUser } = useApiStore();
    const { user } = useAuthStore();
    const [modalOpenMateria, setModalOpenMateria] = useState(false)
    const [modalOpenProfesor, setModalOpenProfesor] = useState(false)

    //! Datos de prueba
    const materias = ['TODOS', 'Matematicas', 'Ingles', 'Frances'];
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
            maxLenght: 10,
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
            accessorKey: 'asignatura',
            header: 'Asignatura',
            //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
            muiTableBodyCellEditTextFieldProps: {
                select: true, //change to select for a dropdown
                children: materias.slice(1).map((materiasValue) => (
                    <MenuItem key={materiasValue} value={materiasValue}>
                        {materiasValue}
                    </MenuItem>
                )),
            },
        },
    ];

    const columnsToAddMateria = [
        {
            accessorKey: 'nombre', //access nested data with dot notation
            header: 'Nombre materia',
            type: 'text',
            muiTableBodyCellEditTextFieldProps: ({ cell, row }) => ({
                ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
            })
        },
        {
            accessorKey: 'codigo', //access nested data with dot notation
            header: 'Codigo',
            type: 'text',
            muiTableBodyCellEditTextFieldProps: ({ cell, row }) => ({
                ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
            })
        },
    ]

    const columnsToAddProfesor = [
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

        // {
        //     accessorKey: 'nombreMateria', //access nested data with dot notation
        //     header: 'Nombre materia',
        //     type: 'text',
        //     muiTableBodyCellEditTextFieldProps: ({ cell, row }) => ({
        //         ...editTextFieldProps({ cell: cell, validationErrors: validationErrors, setValidationErrors: setValidationErrors }),
        //     })
        // }
    ]

    const handleChangeSelect = (e) => {
        if (e.target.value !== 'TODOS') {
            // onGetAllUser({
            // url: 'profesores',
            // tipo: "profesores",
            // filter: { tipo: 'fk_rol_administrador', tipoSecondario: "", filter: e.target.value }
            // });
        } else {
            onGetAllUser({
                url: 'profesores',
                tipo: "profesores"
            });
        }
    }

    const onGetData = async () => {
        Promise.all([
            onGetAllUser({
                url: 'profesores',
                tipo: "profesores"
            }),
        ]).then((values) => {
        });
    }

    useEffect(() => {

        //* El primer cargado seria el de los Profesores
        onGetData();

    }, [])

    //*Abrir el modal para agregar una nueva materia
    const AddNewMateria = () => {
        setModalOpenMateria(true);
    }
    //*Abrir el modal para agregar un nuevo Profesor
    const AddNewProfesor = () => {
        setModalOpenProfesor(true);
    }

    //* Para crear una nueva Materia
    const handleCreateMateria = (values) => {
        console.log(values)
    }

    //* Para crear un nuevo Profesor
    const handleCreateProfesor = (values) => {

        values.fk_institucion = user.fk_institucion;
        values.tipo_usuario = 3; //Profesor
        values.genero = "M";

        values.fecha_nacimiento = format(new Date(values.fecha_nacimiento), "yyyy-MM-dd")

        console.log("Data a enviar ", values)

        onSaveUser({ url: '/profesores', dataSave: values });
    };

    const handleEditProfesor = async ({ exitEditingMode, row, values }) => {

        //* Evalua que los valores no esten vacios
        //* Como es un objeto lo lee con keys para evaluar la cantidad de datos existentes
        if (!Object.keys(validationErrors).length) {
 
            onEditUser({ url: `${'profesores/'}${row.original.id}`, dataEdit: values, tipo: "id" });

            exitEditingMode(); //required to exit editing mode and close modal
        }
    };



    return (
        <div className='mt-3 mb-3 vh_100'>

            <h2>Administrar Profesores</h2>
            <hr />
            <h3></h3>
            <div className='d-flex justify-content-between mb-4'>
                <div className='d-flex gap-3'>

                    <TextField
                        id="outlined-select-currency"
                        className='ml-4'
                        select
                        name={"Materias"}
                        defaultValue={materias[0]}
                        label={"Materias"}
                        helperText="Seleccione para filtrar por materia"
                        onChange={(e) => handleChangeSelect(e)}
                    >
                        {
                            materias.map((value) => {
                                return (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                )
                            })
                        }
                    </TextField>

                </div>

                <div className='d-flex h-100 align-self-center gap-3'>
                    <button
                        onClick={AddNewMateria}
                        className='btn btn-outline-secondary'
                    >
                        Agregar Materia
                    </button>

                    <button
                        onClick={AddNewProfesor}
                        className='btn btn-primary'
                    >
                        Agregar Usuario Administrador
                    </button>
                </div>

            </div>
            <h4 className='btn-danger'>TODO: Configurar tabla</h4>

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
                handleSaveRowEdits={handleEditProfesor}
            />

            <NewDataModal
                columns={columnsToAddMateria}
                modalOpen={modalOpenMateria}
                onClose={() => setModalOpenMateria(false)}
                onSubmit={handleCreateMateria}
                title={'Agregar Materia'}
            />

            <NewDataModal
                columns={columnsToAddProfesor.slice(1)}
                modalOpen={modalOpenProfesor}
                onClose={() => setModalOpenProfesor(false)}
                onSubmit={handleCreateProfesor}
                title={'Agregar Profesor'}
            />

        </div>
    )
}
