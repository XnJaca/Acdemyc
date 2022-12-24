import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here


import CSVReader from 'react-csv-reader'

import { MRT_Localization_ES, validateAge, validateEmail, validateRequired } from '../helpers';
import { useApiStore } from '../hooks';

export const TablaDatos = ({ columns = [], setValidationErrors,validationErrors,urlEdit }) => {
     
    const { status, data, onEdit } = useApiStore();

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState(() => data);
    // const [validationErrors, setValidationErrors] = useState({});
 
    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        //* Evalua que los valores no esten vacios
        //* Como es un objeto lo lee con keys para evaluar la cantidad de datos existentes
        if (!Object.keys(validationErrors).length) {

            //? aqui limitamos los botones para que no puedan enviarlo dos veces
            //? o un peque;o gift al boton para saber que esta cargando
            //? o un toast para que sepa que esta cargando
            //? o desactivar los inputs para que no pueda editar nada

            onEdit(`${urlEdit}${row.original.ID}`, values);

            exitEditingMode(); //required to exit editing mode and close modal
        }
    };

    const handleCancelRowEdits = () => {
        //* Coloca los valores de los errores en vacio 
        //* Para que los errores no se queden en la tabla
        setValidationErrors({});
    };

    const handleDeleteRow = useCallback(
        (row) => {
            if (!confirm(`Esta seguro que desea eliminar al usuario `)) {
                return;
            }

            //send api delete request here, then refetch or update local table data for re-render
            tableData.splice(row.index, 1);
            setTableData([...tableData]);
        },
        [tableData],
    );

    //* Uso de las validaciones en cada columna y cuando se cree el edit de la tabla
    // const editTextFieldProps = useCallback(
    //     (cell) => {
    //         return {
    //             error: !!validationErrors[cell.id],
    //             helperText: validationErrors[cell.id],
    //             //* El onBlur es un evento que sucede cuando el usuario sale de un input
    //             onBlur: (event) => {
    //                 //* La celda es el valor actual del input, se selecciona por el id
    //                 //* El id seria el nombre o la key de la base de datos
    //                 const isValid =
    //                     cell.column.id === 'Email'
    //                         //* Esta funcion evalua si tiene los datos correctos para un correo
    //                         ? validateEmail(event.target.value)
    //                         : cell.column.id === 'age'
    //                             //* Esta funcion evalua si la edad esta determinada de un rango a otro
    //                             ? validateAge(event.target.value)
    //                             //* Esta funcion evalua si esta vacia el target actual
    //                             : validateRequired(event.target.value);
    //                 if (!isValid) {
    //                     //* Coloca el valor de la celda en el objeto de errores
    //                     setValidationErrors({
    //                         ...validationErrors,
    //                         [cell.id]: `${cell.column.columnDef.header} Es requerido`,
    //                     });
    //                 } else {
    //                     //* Remueve el valor del error si todo esta correcto
    //                     delete validationErrors[cell.id];
    //                     setValidationErrors({
    //                         ...validationErrors,
    //                     });
    //                 }
    //             },
    //         };
    //     },
    //     [validationErrors],
    // );

    // columns = useMemo(() => [
    //     {
    //         accessorKey: 'Nombre', //access nested data with dot notation
    //         header: 'Nombre',
    //         //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
    //         muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
    //             ...editTextFieldProps(cell),
    //         }),
    //     },
    //     {
    //         accessorKey: 'Apellido_1',
    //         header: 'Apellido 1',
    //         //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
    //         muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
    //             ...editTextFieldProps(cell),
    //         }),
    //     },
    //     {
    //         accessorKey: 'Apellido_2', //normal accessorKey
    //         header: 'Apellido 2',
    //         //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
    //         muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
    //             ...editTextFieldProps(cell),
    //         }),
    //     },
    //     {
    //         accessorKey: 'Email',
    //         header: 'Email',
    //         //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
    //         muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
    //             ...editTextFieldProps(cell),
    //             type: 'email',
    //         }),
    //     },
    //     {
    //         accessorKey: 'Telefono',
    //         header: 'Telefono',
    //         //* Este metodo es para decir que tipo de propiedades desea para este valor en especifico
    //         muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
    //             ...editTextFieldProps(cell),
    //             type: 'number',
    //         }),
    //     },

    // ], [editTextFieldProps]);

    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        title: 'Lista administradores',
        filename: 'Lista administradores',
        useBom: true,
        useKeysAsHeaders: false,
        headers: columns.map((c) => c.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);

    const handleExportRows = (rows) => {
        csvExporter.generateCsv(rows.map((row) => row.original));
    }; //para exportar los datos de la tabla

    //reader
    const papaparseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
    };

    const handleForce = (data, fileInfo) => setdatosLeidos(() => {
        var objetoDevuelto = [];
        data.forEach((val, index) => {

            if (val.length > 1 && index > 0) {
                objetoDevuelto.push({
                    Nombre: val[0],
                    Apellido_1: val[1],
                    Apellido_2: val[2],
                    Email: val[3],
                    Telefono: val[4],
                })
            }

        });
        console.log(objetoDevuelto)
        return objetoDevuelto;
    });

    const [datosLeidos, setdatosLeidos] = useState([])

    //Para leer el archivo csv y cargarlo en la tabla
    // return (
    //     <div className="container">
    //         <CSVReader
    //             cssClass="react-csv-input"
    //             label="Seleccione lista de administradores para ingresar"
    //             onFileLoaded={handleForce}
    //         // parserOptions={papaparseOptions}
    //         />
    //         <p>and then open the console</p>

    //         <MaterialReactTable columns={columns}
    //             data={datosLeidos ?? []}
    //         />
    //     </div>
    // )

    return (
        <>
            <MaterialReactTable
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        size: 120,
                    },
                }}
                initialState={{
                    density: 'compact',
                }}
                localization={MRT_Localization_ES}
                state={{
                    //showAlertBanner: isError.status,
                    // showProgressBars: loading,
                    showSkeletons: status
                }}
                enablePinning
                columns={columns}
                data={data ?? []}
                editingMode="modal" //default   
                enableEditing
                enableColumnOrdering //para mover como se desee 
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
                positionActionsColumn={"last"}
            // muiSearchTextFieldProps={{
            //     placeholder: 'Search Table APIs',
            //     sx: { minWidth: '18rem' },
            //     variant: 'outlined',
            // }}
            // renderRowActions={({ row, table }) => (
            //     <Box sx={{ display: 'flex', gap: '1rem' }}>
            //         <Tooltip arrow placement="left" title="Edit">
            //             <IconButton onClick={() => {
            //                 table.setEditingRow(row)
            //                 console.log("Abrimos un modal random que queramos lo cargamos con los datos");
            //                 console.log(row);
            //                 console.log("y ejecutamos la opcion que aparece cuando se edita algo que es: handleSaveRowEdits()");
            //             }}>
            //                 <Edit />
            //             </IconButton>
            //         </Tooltip>
            //         <Tooltip arrow placement="right" title="Delete">
            //             <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            //                 <Delete />
            //             </IconButton>
            //         </Tooltip>
            //     </Box>
            // )}
            // renderTopToolbarCustomActions={() => (
            //     <Button
            //         color="secondary"
            //         onClick={() => setCreateModalOpen(true)}
            //         variant="contained"
            //     >
            //         Create New Account
            //     </Button>
            // )}
            // muiToolbarAlertBannerProps={
            //     isError.status
            //         ? {
            //             color: 'error',
            //             children: 'Error loading data',
            //         }
            //         : undefined
            // }
            />
        </>
    )
}