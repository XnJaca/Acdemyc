import { createSlice } from '@reduxjs/toolkit';
import { addHours } from 'date-fns';


const tempEvent = {
    calendarId: new Date().getTime(),
    title: "cumple del jefe",
    notes: 'Hay que comprar el paste',
    start: new Date(),
    end: addHours(new Date(), 2),
    bgColor: '#fafafa',
    user: {
        uid: 1,
        name: 'Alejandro'
    }
}

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        isLoadingEvents: true,
        events: [
            tempEvent
        ],
        isLoading: false,
        activeEvent: null,
        calendarList: [], //? Aqui guardariamos el arreglo de Calendarios
        calendarActive: {}, //? Aqui guardariamos el calendario activo
    },
    reducers: {
        onSetActiveEvent: (state, { payload }) => {//es una actino 
            state.activeEvent = payload
        },
        onLoading: (state) => {
            state.isLoading = true;
        },
        onAddNewEvent: (state, { payload }) => {
            const { events, calendario } = payload;

            state.events = events;

            // const calendarList = state.calendarList.map(calendar => {
            //     if (calendar.CalendarId === calendario.CalendarId) {
            //         return calendario;
            //     } else {
            //         return calendar;
            //     }
            // })

            state.isLoading = false;
            // state.calendarList = calendarList;
            state.calendarActive = calendario;

            state.activeEvent = null;
        },
        onUpdateEvent: (state, { payload }) => {

            //!Cambiar esto para guardarlo en el CalendarList y CalendarActive
            state.isLoading = false;

            state.events = state.events.map(event => {
                if (event.id === payload.id) {
                    return payload
                }
                return event;
            })

        },
        onDeleteEvent: (state, { payload }) => {
            const { calendario, events } = payload

            if (state.activeEvent) {
                state.events = events;
                state.activeEvent = null;
            }
            state.calendarActive = calendario;
            state.isLoading = false;

            //*Esto es para actualizacion de algun calendario y cambiar la informacion
            //*Del calendarioActive
            const calendarList = state.calendarList.map(calendar => {
                if (calendar.CalendarId === calendario.CalendarId) {
                    return calendario;
                } else {
                    return calendar;
                }
            })
            state.calendarList = calendarList;

        },
        onLoadEvents: (state, { payload }) => {

            const { events = [], calendario, calendarList } = payload

            state.isLoading = false;
            state.isLoadingEvents = false;
            state.calendarActive = calendario;
            state.calendarList = calendarList;

            events.forEach(event => {
                const exists = state.events.some(dbEvent => dbEvent.id === event.id);
                if (!exists) {
                    state.events.push(event);
                }
            })
        },
        onSelectCalendarEvent: (state, { payload }) => {
            const { events = [], calendario } = payload

            state.isLoading = false;
            state.isLoadingEvents = false;
            state.calendarActive = calendario;

            //*Reiniciamos el arreglo de eventos para que no se carguen y carguen otra vez
            //*Porque en el arreglo de abajo realizamos un cargado para que no se repitan en el arreglo
            state.events = [];
            state.activeEvent = null;

            //*Esto es sino existe lo agrega, osea si hay 2 calendarios agrega uno y queda en 3
            // state.calendarList.forEach(calendar => {
            //     const exists = state.calendarList.some(dbCalendar => dbCalendar?.CalendarId === calendar.CalendarId);
            //     if (!exists) {
            //         state.calendarList.push(calendar);
            //     }
            // })

            //*Esto es para actualizacion de algun calendario y cambiar la informacion
            //*Del calendarioActive
            const calendarList = state.calendarList.map(calendar => {
                if (calendar.CalendarId === calendario.CalendarId) {
                    return calendario;
                } else {
                    return calendar;
                }
            })
            state.calendarList = calendarList;

            //?ForEach
            events.forEach(event => {
                //*El --state.events.some-- devuelve true si ya existe, como es un forEach recorre los eventos que vienen
                //*Y lo va agregando poco a poco, asi no carga todo el arreglo desde cero
                const exists = state.events.some(dbEvent => dbEvent.id === event.id);
                if (!exists) {
                    state.events.push(event);
                }
            })
        },
        onLogoutCalendar: (state) => {
            state.isLoadingEvents = true;
            state.isLoading = false;
            state.events = [];
            state.activeEvent = null;
            state.calendarActive = {};
            state.calendarList = []
        },
        onResetEvents: (state) => {
            state.isLoadingEvents = false;
            state.isLoading = false;
            state.events = [];
            state.activeEvent = null;
        },
        onUpdateCalendarList: (state, { payload }) => { //!----

            const { calendarList, user } = payload;

            //*Revisamos si estamos eliminando algo de algun calendario o si solo modificando un calendario
            if (state.calendarList.length > calendarList.length) {

                var calendarioExists;

                //*Hago un mape del calendarList que viene ya disminuido, 
                //*Reviso si puedo activar un calendario, revisando si el usuario ya acepto ese calendario
                //*Y revisando si el usuario es admin del calendario
                calendarList.map(calendario => {
                    if (calendario.userPrimary._id === user.uid) {
                        calendarioExists = calendario
                    } else {
                        calendario.calendarEvent.users.map(users => {
                            if (users.user.uid === user.uid && users.accept === "Accept") {
                                calendarioExists = calendario
                            }
                        })
                    }
                });

                //*Despues verifico si calendarioExists es diferente de undefined y le coloco
                //*Los valores al calendarActive y tambien importante a los eventos
                if (calendarioExists !== undefined) {
                    state.calendarActive = calendarioExists;
                    state.events = calendarioExists.calendarEvent.events;
                }
            };


            state.isLoading = false;
            state.calendarList = calendarList;

        },
        isNewCalendar: (state, { payload }) => {
            const { calendarActiveUpdate, calendarList, events } = payload

            state.calendarList = calendarList;
            state.calendarActive = calendarActiveUpdate;
            state.events = events;
            state.activeEvent = null

        },
        onUpdateCalendar: (state, { payload }) => {

            state.isLoading = false;

            const { calendario } = payload;

            if (state.calendarActive.CalendarId === calendario.CalendarId) {
                state.calendarActive = calendario
            }

            //*Esto es para actualizacion de algun calendario y cambiar la informacion
            //*Del calendarioActive
            const calendarList = state.calendarList.map(calendar => {
                if (calendar.CalendarId === calendario.CalendarId) {
                    return calendario;
                } else {
                    return calendar;
                }
            })
            state.calendarList = calendarList;

        },
        onAddNewCalendar: (state, { payload }) => {

            state.calendarList = [...state.calendarList, payload];
            state.calendarActive = payload;
            state.events = payload.calendarEvent.events;
        }
    },
})
export const {

    onAddNewEvent,
    onDeleteEvent,
    onLoadEvents,
    onSetActiveEvent,
    onUpdateEvent,
    onLogoutCalendar,
    //onResetEvents,
    onSelectCalendarEvent,
    onUpdateCalendarList,
    onUpdateCalendar,
    onLoading,
    onAddNewCalendar,
    isNewCalendar,

} = calendarSlice.actions