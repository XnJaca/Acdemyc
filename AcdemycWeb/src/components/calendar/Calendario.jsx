import { addHours } from 'date-fns';
import { useState } from 'react';
import { Calendar } from 'react-big-calendar';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { localizer, getMessagesES } from '../../helpers'
import { useAuthStore, useCalendarStore, useUiStore } from '../../hooks';
import { EventModal } from '../EventModal';
import { CalendarEvent } from './components/CalendarEvent';

export const Calendario = () => {

    const { user } = useAuthStore()
    const { onOpenModal } = useUiStore();

    const { events, setActiveEvent, startLoadingEvents, calendarActive, calendarList } = useCalendarStore();

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'agenda')

    //la colocacion de informacion aqui es importante saber cual es primero segundo etc
    const eventStyleGetter = (events, start, end, isSelected) => {

        const isMyEvent = (user.uid === events.user.uid)
        //para poder editar datos del calendario si se desea colocar algun color nuevo 
        //y que tenga alguna diferencia cada cosa
        const style = {
            backgroundColor: (isMyEvent ? events?.style : "#465660"),
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white'
        }

        return {
            style
        }
    }
    const onDoubleClick = (event) => {
        setActiveEvent(event);
        onOpenModal();
    }

    const onSelect = (event) => {
        console.log(event)
    }

    const onViewChanged = (event) => {
        localStorage.setItem('lastView', event)
        setLastView(event)
    };

    const OpenModalEvent = () => {
        setActiveEvent({
            title: "",
            notes: '',
            start: new Date().getTime(),
            end: addHours(new Date(), 2).getTime(),
            bgColor: '#fafafa',
            user: {
                uid: '',
                name: ''
            }
        });
        onOpenModal();
    };




    return (

        <div className='mt-1 '>
            <div className='d-flex justify-content-center'>
                <h2>Calendario</h2>
            </div>

            <div className='d-flex justify-content-start mb-3'>
                <button onClick={OpenModalEvent} className='btn btn-primary'>Agregar Evento al Calendario</button>
            </div> 

            <Calendar
                culture='es'
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 80px)' }}
                messages={getMessagesES()}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />

            <EventModal />
        </div>

    )
}
