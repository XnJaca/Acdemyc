
import Modal from 'react-modal';
import MaterialReactTable from 'material-react-table';
import { Box } from '@mui/system';
import { IconButton, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { MRT_Localization_ES } from '../../helpers';
import { useApiStore } from '../../hooks';
import * as XLSX from 'xlsx';
import { useState } from 'react';

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

export const ExcelModal = ({
    onClose,
    modalOpen,
    title,
    onSaveDataArray,
}) => {


    const { status } = useApiStore();
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([])

    const onLoadExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: "buffer" });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);

                setData(data); // Aqui se guarda el excel en un estado
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        //* Aqui se imprime el excel en consola
        promise.then((d) => {
            //* Obtenemos el arrelo de los valores del objeto que devuelve
            //* Luego lo convertimos en un arreglo de objetos para que MaterialReactTable lo pueda leer
            let columns = Object.keys(d[0]);
            for (let i = 0; i < columns.length; i++) {
                const element = columns[i];
                columns[i] = {
                    accessorKey: element,
                    header: element,
                    size: 80,
                    enableEditing: false,
                    enableHiding: true,
                }
            }
            setColumns(columns);
            
            //restorna columnas y retorna data

        });
    };

    const handleClose = () => {
        onClose();
        setData([]);
        setColumns([]);
    };

    console.log(columns)
    console.log(data)


    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={handleClose}
            style={customStyles}
            className='modalEvento overflow-auto pt-4 pb-4 w-75'
            overlayClassName='modalEvento-fondo'
            closeTimeOutMS={300}
        >
            <h1 className="text-center mb-4"> {title} </h1>

            <div className='mb-2 mr-3 d-flex flex-column align-items-end'>
                <label htmlFor="cargarExcel" className="inputFileStyle">
                    <img src="/icons/excelIcon.png" width={25} alt="Excel" /> Cargar Archivo
                </label>
                <input
                    type="file"
                    name="cargarExcel"
                    id="cargarExcel"
                    className='inputFileHidden'
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={(e) => {
                        const archivo = e.target.files[0];
                        onLoadExcel(archivo);
                    }}
                />
            </div>

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
                    columns={columns ?? []}
                    state={{
                        showSkeletons: status
                    }}
                    data={data ?? []}
                    localization={MRT_Localization_ES}
                />
            </div>

            <div className='mt-3 mr-3 d-flex justify-content-end'>
                <button 
                    className='btn btn-outline-primary'
                    onClick={() => console.log('Guardamos la data, pero se envia hacia el padre mejor')}
                >Guardar</button>
            </div>

        </Modal >

    )
}
