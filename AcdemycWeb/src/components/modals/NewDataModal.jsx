import { MenuItem, TextField, Menu, Button } from "@mui/material";
import { useState } from "react";
import Modal from 'react-modal'
import { validateRequired, validateRequiredNumber } from "../../helpers";
import { DesktopDatePicker, esES } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Swal from "sweetalert2";

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

{/* <MobileDatePicker
          label="Date mobile"
          inputFormat="MM/DD/YYYY"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        /> */}

export const NewDataModal = ({ columns = [], modalOpen = false, onClose, onSubmit, title }) => {

    const [values, setValues] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );
    const [names, setNames] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.header ?? ''] = '';
            return acc;
        }, {}),
    );

    var errors = {};

    const [validationErrors, setValidationErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(values);
        console.log(validationErrors);
        //* Validacion de primera vez
        if (validarPrimeraEntrada()) return;

        //* Validacion de segunda vez cuando un dato cambio
        if (Object.keys(validationErrors).length > 0) return;

        console.log("Todo bien!!! A Guardar KYAAAAAAAAAA")
        onSubmit(values);
        handleClose();
    };

    const validationTextField = (objectFirstValue, name) => {

        let isValid = validateRequiredNumber(objectFirstValue[name]);

        if (!isValid) {
            isValid = validateRequired(objectFirstValue[name]);
        }

        if (name == 'cedula') {
            if (objectFirstValue[name].length < 8 || objectFirstValue[name].length > 12) {
                isValid = false;
            }
        }
        if (name == 'celular') {
            if (objectFirstValue[name].length < 8 || objectFirstValue[name].length > 11) {
                isValid = false;
            }
        }

        if (!isValid) {
            //* Coloca el valor de la celda en el objeto de errores

            if (name == 'cedula') {
                setValidationErrors({
                    ...validationErrors,
                    [name]: `${name} Es requerido y debe ser de min 8 a max 12 digitos`,
                });
            } else if (name == 'celular') {
                setValidationErrors({
                    ...validationErrors,
                    [name]: `${name} Es requerido y debe ser de min 8 a max 11 digitos`,
                });
            } else {
                setValidationErrors({
                    ...validationErrors,
                    [name]: `${name} Es requerido`,
                });
            }

        } else {
            //* Remueve el valor del error si todo esta correcto
            delete validationErrors[name];
            setValidationErrors({
                ...validationErrors,
            });
        };



    };

    const validarPrimeraEntrada = () => {
        var i = 0;
        var arrayNames = Object.keys(names);
        for (const formValue of Object.keys(values)) {

            let isValid = validateRequiredNumber(values[formValue]);
            if (!isValid) {
                isValid = validateRequired(values[formValue]);
            }

            if (!isValid) {
                errors[formValue] = `${arrayNames[i]} Es requerido`;
                //* Coloca el valor de la celda en el objeto de errores
                setValidationErrors(errors);
            } else {
                //* Remueve el valor del error si todo esta correcto 
                delete errors[formValue];
                setValidationErrors(errors);
            };
            i++;
        }

        return (Object.keys(errors).length > 0) ? true : false;

    }

    //Recordar mandar por referencia y no activar de una
    const handleClose = () => {
        //* Cerramos el modal y reiniciamos todos los valores a como entraron
        onClose()
        setValidationErrors({});
        errors = {};
        setValues(() => columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}));
    }

    const classGrid = columns.length % 2 === 0 ? '' : 'ultimoDatoColumna';

    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={handleClose}
            style={customStyles}
            className='modalEvento overflow-auto pt-4 pb-4'
            overlayClassName='modalEvento-fondo'
            closeTimeOutMS={300}
        >
            <h1 className="text-center"> {title} </h1>
            <hr />
            <form className="container" onSubmit={handleSubmit}>
                <div className={`newModalDataColumn ${classGrid}`}>
                    {columns.map((column) => {
                        if (column.type === 'date') {

                            (values[column.accessorKey] === '')
                                ? setValues({ ...values, [column.accessorKey]: new Date().toDateString() })
                                : {}
                            return (
                                <LocalizationProvider key={column.accessorKey} dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label={column.header}
                                        name={column.accessorKey}
                                        localeText={esES}
                                        maxDate={new Date()}
                                        value={values[column.accessorKey]}
                                        onChange={(e) => {
                                            setValues({ ...values, [column.accessorKey]:  e })
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>

                            )
                        }

                        if (column.muiTableBodyCellEditTextFieldProps.children) {

                            var children = column.muiTableBodyCellEditTextFieldProps.children;
                            return (
                                <TextField
                                    key={column.accessorKey}
                                    id="outlined-select-currency"
                                    select
                                    error={!!validationErrors[column.accessorKey]}
                                    helperText={validationErrors[column.accessorKey]}
                                    label={column.header}
                                    name={column.accessorKey}
                                    value={values[column.accessorKey] ?? ''}
                                    onChange={(e) => {
                                        setValues({ ...values, [e.target.name]: e.target.value }),
                                            validationTextField({ ...values, [e.target.name]: e.target.value }, [e.target.name])
                                    }}
                                >
                                    {
                                        children.map(element => {
                                            var props = element.props;
                                            return (
                                                <MenuItem key={element.key} value={props.value} >
                                                    {props.children}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </TextField>
                            )
                        } else {

                            return (
                                <TextField
                                    error={!!validationErrors[column.accessorKey]}
                                    key={column.accessorKey}
                                    label={column.header}
                                    helperText={validationErrors[column.accessorKey]}
                                    name={column.accessorKey}
                                    type={column.type}
                                    
                                    maxLength={column.maxLength ? column.maxLength : 150}
                                    multiline={!!column.multiline}
                                    maxRows={column.maxRows ? column.maxRows : 0}
                                    InputLabelProps={column.shrink ? { shrink: true } : {}}
                                    onChange={(e) => {
                                        setValues({ ...values, [e.target.name]: e.target.value.toString() }),
                                            validationTextField({ ...values, [e.target.name]: e.target.value.toString() }, [e.target.name])
                                    }
                                    }
                                />
                            )

                        }


                    })}
                </div>

                <div className="d-flex">

                    <button
                        type="button"
                        className="btn btn-outline-danger mr-2 btn-block mt-0"
                        disabled={false}
                        onClick={handleClose}
                    >
                        <i className="fa mr-1"></i>
                        <span>Cancelar</span>
                    </button>

                    <button
                        type="submit"
                        className="btn btn-outline-primary btn-block   mt-0"
                        disabled={false}
                    >
                        <i className="fa far fa-save mr-1" ></i>
                        <span>Guardar</span>
                    </button>

                </div>

            </form>
        </Modal >
    )
}
