import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here


// import CSVReader from 'react-csv-reader'

import { MRT_Localization_ES, validateAge, validateEmail, validateRequired } from '../helpers';
import { useApiStore } from '../hooks';

//* El tipeEdit es el id al que se va a editar
export const TablaDatos = ({
    columns = [],
    setValidationErrors,
    validationErrors,
    urlEdit,
    typeEdit,
    handleSaveRowEdits
}) => {

    const { status, data, isError, onEditUser } = useApiStore();
    const [tableData, setTableData] = useState(() => data);
    // const [validationErrors, setValidationErrors] = useState({}); 


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
                positionActionsColumn={"last"}
                
                enableHiding={false}
                initialState={{
                    columnVisibility: { id: false },
                    density: 'compact',
                }}
                localization={MRT_Localization_ES}
                state={{
                    showAlertBanner: isError,
                    // showProgressBars: loading,
                    showSkeletons: status
                }}
                // enablePinning
                // enableRowNumbers
                columns={columns}
                data={data ?? []}
                editingMode="modal"
                enableEditing={true}
                // enableColumnDragging={false}
                // enableDensityToggle={false}
                // enableTopToolbar={false}    
                // enableColumnOrdering //para mover como se desee

                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
                
                muiToolbarAlertBannerProps={
                    isError
                        ? {
                            color: 'error',
                            children: 'Error Cargando datos',
                        }
                        : undefined
                }
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
            />
        </>
    )
}