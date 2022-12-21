import React, { useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here

import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query';
import acdemycApi from '../api/acdemycApi';

import CSVReader from 'react-csv-reader'


const queryClient = new QueryClient();

const TablaDatos = ({ columns = [], data1 = [], }) => {

    columns = [
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

    const { isLoading, error, data, refetch, isFetching } = useQuery([
        'AdminList'
    ], async () => {
        return await acdemycApi.get('usuarios').then(val => {
            //* Devolvemos el array de objetos pero con los datos especificos de la tabla
            return val.data.users.map((val) => {
                return {
                    Nombre: val.Nombre,
                    Apellido_1: val.Apellido_1,
                    Apellido_2: val.Apellido_2,
                    Email: val.Email,
                    Telefono: val.Telefono,
                }
            })

        });
    },
        { keepPreviousData: true }
    )

    //!Alerta con esto se repite mucho
    //console.log(data)


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
        console.log(rows)
        csvExporter.generateCsv(rows.map((row) => row.original));
    };


    //reader
    const papaparseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
    };

    const handleForce = (data, fileInfo) => setdatosLeidos(() => {
        var objetoDevuelto = [];
         data.forEach((val,index ) => {

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

    return (
        <div className="container">
            <CSVReader
                cssClass="react-csv-input"
                label="Seleccione lista de administradores para ingresar"
                onFileLoaded={handleForce}
            // parserOptions={papaparseOptions}
            />
            <p>and then open the console</p>

            <MaterialReactTable columns={columns}
                data={datosLeidos ?? []}
            />
        </div>
    )

    return (

        <div>


            <MaterialReactTable columns={columns}
                data={data ?? []}
                muiToolbarAlertBannerProps={
                    error
                        ? {
                            color: 'error',
                            children: 'Error loading data',
                        }
                        : undefined
                }
                state={{
                    isLoading,
                    showAlertBanner: error,
                    showProgressBars: isFetching,
                }}
                renderTopToolbarCustomActions={() => (
                    <Tooltip arrow title="Refresh Data">
                        <IconButton onClick={refetch}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                )}
            />

            <MaterialReactTable
                columns={columns}
                data={data ?? []}
                enableRowSelection //Para seleccionar las filas
                positionToolbarAlertBanner="bottom"
                renderTopToolbarCustomActions={({ table }) => (
                    <Box
                        sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                    >
                        <Button
                            disabled={table.getPrePaginationRowModel().rows.length === 0}
                            //export all rows, including from the next page, (still respects filtering and sorting)
                            onClick={() =>
                                handleExportRows(table.getPrePaginationRowModel().rows)
                            }
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Exportar a Excel
                        </Button>
                        <Button
                            disabled={
                                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                            }
                            //only export selected rows
                            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Exportar a Excel Filas
                        </Button>
                    </Box>
                )}
            />

        </div>
    )
}


export const ExampleWithReactQueryProvider = () => (
    <QueryClientProvider client={queryClient}>
        <TablaDatos />
    </QueryClientProvider>
);