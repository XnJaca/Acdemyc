import { addHours, differenceInSeconds } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal'

import 'sweetalert2/dist/sweetalert2.css'

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import Swal from 'sweetalert2';
import { useCalendarStore, useAuthStore, useUiStore } from '../../hooks';

registerLocale('es', es)

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

export const EventModal = () => {

    const { isDateModalOpen, onOpenModal, onCloseModal } = useUiStore()
    const { activeEvent, startSavingEvent, isLoading } = useCalendarStore();
    const { user, tipoUsuario } = useAuthStore()

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectColor, setSelectColor] = useState(false)
    const [style, setStyle] = useState(activeEvent?.style || '#347CF7');

    const [formValue, setFormValue] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2),
    })

    const titleClass = useMemo(() => {
        if (!formSubmitted) return '';

        return ((formValue.title.length > 0)
            ? ''
            : 'is-invalid')

    }, [formValue.title, formSubmitted])

    useEffect(() => {
        if (activeEvent !== null) {
            setFormValue({ ...activeEvent })
        };

    }, [activeEvent])

    const onInputChanged = ({ target }) => {
        setFormValue({
            ...formValue,
            [target.name]: target.value
        })
    }

    const onDateChanged = (event, changing) => {
        setFormValue({
            ...formValue,
            [changing]: event,
        })
    }

    const onCloseModalEvent = () => {
        setSelectColor(false)
        onCloseModal();
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        setFormSubmitted(true)

        const difference = differenceInSeconds(formValue.end, formValue.start)

        if (isNaN(difference) || difference <= 0) {
            Swal.fire('Fechas no son correctas', '', 'error')
            return;
        }

        if (formValue.title.length <= 0) return;

        console.log({ ...formValue, style })
        await startSavingEvent({ ...formValue, style });

        //!El modal solo se cierra aqui, cuando se EDITA, despues se cierra en el useCalendarStore
        //!Cuando se crea el evento
        if (formValue.id) onCloseModal();

        onCloseModal();
        setFormSubmitted(false)
        setSelectColor(false)
    }

    const selectedColor = (e) => {
        console.log(e.target.style.border.length)

        if (e.target.style.border.length === 0 && !selectColor) {

            e.target.style.border = '2px solid black';
            setSelectColor(true)

            setStyle(e.target.style.backgroundColor)

        } else if (e.target.style.border.length !== 0) {

            e.target.style.border = '';
            setSelectColor(false)
            setStyle('#347CF7');
        }
    }

    var disabled = tipoUsuario.descripcion === 'ADMINISTRADOR' ? false : true;

    //*Para manejar el disabled del button
    // var loading
    // if (activeEvent?.user.uid === '') {
    //     loading = false
    //     if (isLoading) {
    //         loading = true
    //     }
    // } else if (user.uid !== activeEvent?.user.uid) {
    //     loading = true
    // } 

    return (
        <div>

            <Modal
                isOpen={isDateModalOpen}
                onRequestClose={onCloseModalEvent}
                style={customStyles}
                className='modalEvento'
                overlayClassName='modalEvento-fondo'
                closeTimeOutMS={300}
            >
                <h1> Nuevo evento </h1>
                <hr />
                <form className="container" onSubmit={onSubmit}>

                    <div className="form-group mb-2">
                        <label>Fecha y hora inicio</label>
                        <DatePicker
                            selected={formValue.start}
                            onChange={(event) => { onDateChanged(event, 'start') }}
                            className='form-control'
                            dateFormat='Pp'//para que aparezcan las horas
                            showTimeSelect
                            locale='es'
                            disabled={disabled}
                            timeCaption='Hora'
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label>Fecha y hora fin</label>
                        <DatePicker
                            minDate={formValue.start}
                            selected={formValue.end}
                            className='form-control'
                            onChange={(event) => { onDateChanged(event, 'end') }}
                            dateFormat='Pp'//para que aparezcan las horas
                            showTimeSelect
                            locale='es'
                            disabled={disabled}
                            timeCaption='Hora'
                        />
                    </div>

                    <hr />
                    <div className="form-group mb-2">
                        <label>Titulo y notas</label>
                        <input
                            type="text"
                            className={`form-control ${titleClass}`}
                            placeholder="Título del evento"
                            name="title"
                            autoComplete="off"
                            disabled={disabled}
                            value={formValue.title}
                            onChange={onInputChanged}
                        />
                        <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                    </div>

                    <div className="form-group mb-2">
                        <textarea
                            type="text"
                            className="form-control"
                            placeholder="Notas"
                            rows="5"
                            name="notes"
                            disabled={disabled}
                            value={formValue.notes}
                            onChange={onInputChanged}
                        ></textarea>
                        <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                    </div>

                    <div className="colorBackgroundEvent mb-2 d-flex">
                        <label>Color:</label>
                        &nbsp;
                        <div className='containerButtonColor'>
                            <button
                                style={{ backgroundColor: '#f02525' }}
                                className='buttonColor'
                                type='button'
                                disabled={disabled}
                                onClick={selectedColor}
                            ></button>
                            <button
                                style={{ backgroundColor: '#347CF7' }}
                                className='buttonColor'
                                type='button'
                                disabled={disabled}
                                onClick={selectedColor}
                            ></button>
                            <button
                                style={{ backgroundColor: '#f2aa58' }}
                                className='buttonColor'
                                type='button'
                                disabled={disabled}
                                onClick={selectedColor}
                            ></button>
                            <button
                                style={{ backgroundColor: '#71e532' }}
                                className='buttonColor'
                                type='button'
                                disabled={disabled}
                                onClick={selectedColor}
                            ></button>
                            <button
                                style={{ backgroundColor: '#c841f6' }}
                                className='buttonColor'
                                type='button'
                                disabled={disabled}
                                onClick={selectedColor}
                            ></button>
                        </div>
                    </div>

                    {
                        (tipoUsuario.descripcion === 'ADMINISTRADOR') && (
                            <button
                                type="submit"
                                className="btn btn-outline-primary btn-block"
                                disabled={false}
                            >
                                <i className="fa far fa-save"></i>
                                <span> Guardar</span>
                            </button>

                        )
                    }
                </form>
            </Modal>
        </div>

    )
}
