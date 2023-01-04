

import Modal from 'react-modal';
import MaterialReactTable from 'material-react-table';
import { Box } from '@mui/system';
import { IconButton, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { MRT_Localization_ES } from '../../helpers';
import { useApiStore } from '../../hooks';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

export const ModalOpcionesRoles = ({
    data = [], setData,
    handleSaveRowEdits, handleDeleteRow,
    columns, modalOpen,
    setValidationErrors, onClose,
    onSubmit, title
}) => {

    const { status } = useApiStore();

    const handleClose = () => {
        onClose();
    };

    const handleCancelRowEdits = () => {
        //* Coloca los valores de los errores en vacio 
        //* Para que los errores no se queden en la tabla
        setValidationErrors({});
    };

    return (

        <Modal
            isOpen={modalOpen}
            onRequestClose={handleClose}
            style={customStyles}
            className='modalEvento overflow-auto pt-4 pb-4'
            overlayClassName='modalEvento-fondo'
            closeTimeOutMS={300}
        >
            <h1 className="text-center mb-4"> {title} </h1>

            <div className='pr-3 pl-3'>
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
                    columns={columns}
                    state={{
                        showSkeletons: status
                    }}
                    data={data ?? []}
                    onEditingRowSave={handleSaveRowEdits}
                    onEditingRowCancel={handleCancelRowEdits}
                    localization={MRT_Localization_ES}
                    enableEditing={true}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                            <Tooltip arrow placement="left" title="Edit">
                                <IconButton onClick={() => table.setEditingRow(row)}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                /> 
            </div>

        </Modal >

    )
}
