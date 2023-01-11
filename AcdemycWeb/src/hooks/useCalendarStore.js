import { ca } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"; 
import acdemycApi from "../api/acdemycApi";
import { convertEventsToDate } from "../helpers";
import { 
    onAddNewEvent,
    onDeleteEvent,
    onLoadEvents,
    onSetActiveEvent,
    onUpdateEvent,
    //onResetEvents,
    onSelectCalendarEvent,
    onUpdateCalendarList,
    onUpdateCalendar,
    onLoading,
    onAddNewCalendar,
    isNewCalendar,
 } from "../store";
 



export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent, calendarList, calendarActive, isLoading } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth); 


    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    //*Cada dato nuevo o actualizacion siempre debe entrar en el calendarioActivo
    const startSavingEvent = async (calendarEvent) => {

        const { CalendarId } = calendarActive;

        try {

            dispatch(onLoading());

            //? Editando EVENTO
            // if (calendarEvent.id) {
            //     await acdemycApi.put(`/events/${calendarEvent.id}`, calendarEvent);
            //     dispatch(onUpdateEvent({ ...calendarEvent, user }));
            //     return;
            // }

            //*Cerramos el MODAL para que se vea mas veloz la aplicacion
            //*Se hace antes de agregar nuevo evento al calendario ya que el dato es mas pesado
            //*Pero despues de editar porque solo es edicion del evento, muy poco pesado


            //? Agregando evento en el CALENDARIO, RETORNAMOS EL CALENDARIO MODIFICADO
            // const { data } = await acdemycApi.put(`/calendar/event/${CalendarId}`, calendarEvent);
            // const { calendario } = data;

            //*Se ejecuta cuando se cargan la primera vez la pagina
            // const events = convertEventsToDate(calendario.calendarEvent.events);\

            calendarEvent.user = user;
            calendarEvent.CalendarId = new Date().getTime();

            dispatch(onAddNewEvent({
                events: [...events,calendarEvent],
                calendario: calendarEvent
            }))

            //onCloseModal();

        } catch (error) {
            console.log(error)
            Swal.fire('Eror al guardar datos', error.response.data?.msg, 'error')
        }
    };

    //*Esto es para crear un nuevo calendario, solo se crea, despues solo se edita los datos dentro
    const startSavingCalendarEvent = async ({ newNameCalendar }) => {

        try {

            const newCalendarDB = {
                userPrimary: user.uid,
                calendarEvent: {
                    nameCalendarEvent: newNameCalendar,
                    users: [],
                    events: []
                }
            };

            //? Creando Calendario
            const { data } = await acdemycApi.post('/calendar', newCalendarDB);
            const { calendario } = data

            dispatch(onAddNewCalendar(calendario))

            //Colocamos que se selecciono ese calendario
            localStorage.setItem('calendarSelected', calendario.CalendarId);

            Swal.fire('Creado correctamente', 'El Calendario a sido creado Correctamente', 'success');

        } catch (error) {
            console.log(error)
            Swal.fire('Erorr al Crear Calendario', 'Ocurrio un error inesperado, contacte administracion', 'error')
        }
    }

    //*Para eliminar un evento de un calendarios
    const startDeletingEvent = async () => {

        try {

            //*Eliminar el dato que se selecciono
            await acdemycApi.delete(`/events/${activeEvent.id}`);

            const eventsDelete = events.filter(event => event.id !== activeEvent.id);

            const calendarUpdateStore = {
                ...calendarActive,
                calendarEvent: {
                    ...calendarActive.calendarEvent,
                    events: eventsDelete
                }
            }

            const { calendarEvent, userPrimary } = calendarUpdateStore

            //*Calendario modificado solo con IDS
            const calendarUpdateDB = {
                CalendarId: calendarUpdateStore.CalendarId,
                calendarEvent: {
                    nameCalendarEvent: calendarEvent.nameCalendarEvent,
                    events: calendarEvent.events.map(event => event.id),
                    users: calendarEvent.users.map(users => {
                        return {
                            accept: users.accept,
                            user: users.user.uid
                        }
                    })
                },
                userPrimary: userPrimary._id,
            }

            await acdemycApi.put(`/calendar/${calendarActive.CalendarId}`, calendarUpdateDB);

            dispatch(onDeleteEvent({ calendario: calendarUpdateStore, events: eventsDelete }))

            Swal.fire('Eliminado', 'El evento a sido eliminado correctamente', 'success')

        } catch (error) {
            console.log(error)
            Swal.fire('Erorr al eliminar', error.response.data?.msg, 'error')
        }
    }

    //* El primero que se ejecuta cuando se carga la base de datos
    //* obtengo todos los datos de los calendarios
    const startLoadingEvents = async () => {

        try {
            //?Para obtener todos los calendarios a los que esta linkeado el usuario
            const { data } = await acdemycApi.get('/calendar');

            const idCalendar = localStorage.getItem("calendarSelected");

            var calendarioExists = [];
            if (idCalendar !== null) {
                calendarioExists = data.calendario.filter(calendario => calendario.CalendarId === idCalendar)
            }

            if (idCalendar === null || calendarioExists.length === 0) {
                //*Hago un mapeo del calendarList que viene ya disminuido, 
                //*Reviso si puedo activar un calendario, revisando si el usuario ya acepto ese calendario
                //*Y revisando si el usuario es admin del calendario
                const calendariosList = data.calendario.filter(calendario => {
                    if (calendario.userPrimary._id === user.uid) {
                        return calendario;
                    } else {
                        calendario.calendarEvent.users.map(users => {
                            if (users.user.uid === user.uid && users.accept === "Accept") {
                                calendarioExists.push(calendario);
                            }
                        })
                    }
                });

                //*La forma de hacer el concat afecta cual va primero y cual segundo
                calendarioExists = calendariosList.concat(calendarioExists)
            }

            //*Esto es por es nuevo usuario y si habia creado el nuevo calendario
            if (calendarioExists.length === 0 && data.calendario.length !== 0) {
                calendarioExists = data.calendario;
            }

            if (calendarioExists.length === 0 && data.calendario.length === 0) {
                Swal.fire('Ocurrio un Error', 'Ocurrio un error al cargar los eventos, porfavor cree uno nuevo', 'error');
            }

            //*viene como un arreglo, como es el primer cargado siempre seleccionara el primero
            //*porque ahi viene la data de el, osea el valor inicial de todo,
            //*ya si desea crear un nuevo evento no cargara aqui, cargara en el boton que selecciono
            //?Aqui lo que se puede hacer es guardar el numero del arreglo en el localStorage, sino existe se coloca 0
            //?Comprobar que el numero no sea mayor al length que tiene la lista, etc, etc.
            const { calendarEvent, userPrimary } = calendarioExists[0];

            //*Se ejecuta cuando se cargan la primera vez la pagina
            const events = convertEventsToDate(calendarEvent.events);

            dispatch(onLoadEvents({ events, calendario: calendarioExists[0], calendarList: data.calendario }));


        } catch (error) {
            console.log('Error Cargando eventos')
            console.log(error)
            console.log(error.response)
        }
    };

    //*Obtener todos los calendarios para verificar si hay alguno nuevo y se actualize
    //*En cualquier momento que se pueda
    const startLoadingCalendarList = async () => {

        try {
            //?Para obtener todos los calendarios a los que esta linkeado el usuario
            const { data } = await acdemycApi.get('/calendar');

            //* Significa que viene vacio. Motivos de que el otro usuario haya eliminado el calendario
            //* Y que calendarios actuales tambien los haya eliminado el mismo usuario
            if (data.calendario.length === 0) {

                //!proceso de usuario nuevo con nuevo calendario
                const newCalendarDB = {
                    userPrimary: user.uid,
                    calendarEvent: {
                        nameCalendarEvent: user.name,
                        users: [],
                        events: []
                    }
                };

                //? Creando Calendario
                const { data: dataCalendar } = await acdemycApi.post('/calendar', newCalendarDB);
                const { calendario } = dataCalendar

                dispatch(isNewCalendar({
                    calendarList: [calendario],
                    calendarActiveUpdate: calendario,
                    events: calendario.calendarEvent.events
                }));

                //!------------

            } else {
                var isCalendarActiveExist;
                var activeCalendar;
                var events;

                //*Colocara un valor al isCalendarActiveExist si coloca un valor es que si existe
                //*Recorremos la lista de la base de datos para verificar si el calendario activo existe
                //*Si existe actualizamos el calendario activo y los events y la lista de calendarios
                data.calendario.forEach(calendario => {
                    if (calendarActive.CalendarId === calendario.CalendarId) {
                        isCalendarActiveExist = true;
                        activeCalendar = calendario;
                        events = activeCalendar.calendarEvent.events;
                    }
                });

                //*Coloco el primer calendario de la lista, si el calendario activo no viene en 
                //*La lista de la base de datos
                if (isCalendarActiveExist === undefined) {
                    activeCalendar = data.calendario[0];
                    events = data.calendario.calendarEvent.events;
                }

                //*Convertir los eventos al tipo de date 
                events = convertEventsToDate(events);

                dispatch(isNewCalendar({
                    calendarList: data.calendario,
                    calendarActiveUpdate: activeCalendar,
                    events
                }));
            };

        } catch (error) {
            console.log('Error al Cargar los calendarios')
            console.log(error)
            console.log(error.response)
        }
    }

    //*Realizara el cargado hacia la store cada vez que se da click en el sideBar
    const startLoadingEventsCalendar = async ({ events, calendarActive }) => {

        try {

            //*Se vuelve a ejecutar para que cambie el valor de las fechas
            const eventsList = convertEventsToDate(events);

            localStorage.setItem("calendarSelected", calendarActive.CalendarId);

            //*Cambiamos los valores en la store enviandole los nuevos events y el calendario que se selecciono
            dispatch(onSelectCalendarEvent({ events: eventsList, calendario: calendarActive }))

        } catch (error) {
            console.log('Error Cargando eventos')
            console.log(error)
            console.log(error.response)
        }
    }
    ///*Funcion para ver si se acepta o no el calendario del usuario, 
    const startDeletingOrAcceptCalendar = async ({ calendarId: calendarIdUpdate, accept }) => {

        try {

            //?Uso en botones, recordar descativarlo en el dispatch base
            dispatch(onLoading());

            //* Si se esta llegando aqui es que el usuario que se esta cambiando es el que esta activo
            //* Asi que se puede usar el valor el usuario Activo para hacer la busqueda de usuarios
            //* Si es igual a accept se ejecuta el guardado normal solo cambiando ese valor

            var calendarUpdate;
            const calendarListUpdate = calendarList.map(calendar => {

                if (calendar.CalendarId === calendarIdUpdate) {//*Comprobamos que sean iguales los dos valores que editaremos

                    //*Comprobamos que el usuario que estamos actualizando sea el usuario activo en el auth
                    //*Y modificamos el usuario dandole en accept 
                    var users;
                    if (accept === "Accept") {
                        users = calendar.calendarEvent.users.map(userCalendar => {
                            if (userCalendar.user.uid === user.uid) {
                                return {
                                    accept: "Accept",
                                    user: userCalendar.user,
                                    _id: userCalendar._id
                                };
                            } else {
                                return userCalendar;
                            }
                        });
                    } else if (accept === "Denied") {
                        users = calendar.calendarEvent.users.filter(userCalendar => {
                            if (userCalendar.user.uid === user.uid) {
                                return;
                            } else {
                                return userCalendar;
                            }
                        });
                    };

                    //*Despues devolvemos el calendario modificado en una variable y tambien guardamos la lista modificada
                    //*En una variable por algun uso posterior
                    calendarUpdate = {
                        ...calendar,
                        calendarEvent: {
                            ...calendar.calendarEvent,
                            users
                        }
                    };
                    return calendarUpdate;
                } else {
                    return calendar;
                }
            });

            //*El calendario que debe recibir la BD debe ser solamente --IDs-- de los datos
            //*Aqui lo modificamos para que solo se envien los IDS
            calendarUpdate = {
                CalendarId: calendarUpdate.CalendarId,
                calendarEvent: {
                    nameCalendarEvent: calendarUpdate.calendarEvent.nameCalendarEvent,
                    events: calendarUpdate.calendarEvent.events.map(event => { return event.id }),
                    users: (calendarUpdate.calendarEvent.users.length > 0) ? calendarUpdate.calendarEvent.users.map(users => {
                        return {
                            accept: users.accept,
                            user: users.user.uid
                        }
                    }) : [],
                },
                userPrimary: calendarUpdate.userPrimary._id
            };

            //*Una vez actualizado el calendario ejecutamos el llamado a la API
            //? Editando CALENDARIO
            await acdemycApi.put(`/calendar/${calendarIdUpdate}`, calendarUpdate);

            if (accept === "Accept") {
                //*Actualizamos la store con la nueva actualizacion, para siempre mantenerla actualizada con cualquier novedad
                dispatch(onUpdateCalendarList({ calendarList: calendarListUpdate, user }));

            } else if (accept === "Denied") {

                //*Si es denied ejecutamos la eliminacion del calendario en la store quitandolo de la lista
                const calendarListUpdateDenied = calendarListUpdate.filter(calendar => {
                    if (calendar.CalendarId === calendarIdUpdate) {
                        return;
                    } else {
                        return calendar;
                    }
                });

                //*Actualizamos la store con la lista de calendarios eliminando el que se denego
                dispatch(onUpdateCalendarList({ calendarList: calendarListUpdateDenied, user }));
            }


        } catch (error) {
            console.log('Error al Aceptar o Denegar el calendario')
            console.log(error)
            console.log(error.response)
        }

    }
    //*Funcion para agregar un nuevo usuario mediante el correo y antes revisando si existe
    const startAddNewUserCalendar = async ({ userExists }) => {
        //el gmail, el calendario activo tambien es necesario
        //es necesario un update del calendario proque al final es una modificacion del user nada mas
        const { CalendarId, calendarEvent, userPrimary } = calendarActive;

        const { events, users, nameCalendarEvent } = calendarEvent;

        try {
            //?Uso en botones, recordar descativarlo en el dispatch base
            dispatch(onLoading());

            //?Obtenemos el usuario ya existente o no dependiendo de lo que hace la busqueda
            //?cuando se abre el modal del SWAL, cuando entre aqui significa que el usuario existe

            var usersList;
            //*Por sino existen usuarios en el arreglo
            if (users.length === 0) {
                usersList = [{ accept: "Process", user: userExists.uid }];
            } else {
                //*Por si ya existen varios usuarios
                var existe = false;
                usersList = users.map(user => {

                    if (user.user.uid === userExists.uid) {
                        //*El usuario ya existe en este arreglo, NO AGREGAR
                        existe = true;
                    } else {
                        return {
                            accept: user.accept,
                            user: user.user.uid
                        }
                    }

                });

                if (!existe) {
                    const userNewBD = {
                        accept: "Process",
                        user: userExists.uid
                    }
                    usersList.push(userNewBD)
                } else {
                    usersList = users.map(user => {
                        return {
                            accept: user.accept,
                            user: user.user.uid
                        }
                    })
                }
            }

            const calendarUpdate = {
                CalendarId,
                calendarEvent: {
                    nameCalendarEvent,
                    events: events.map(event => event.id),
                    users: usersList
                },
                userPrimary: userPrimary._id,
            }

            //? Editando calendario agregando un nuevo usuario, esto solo retorna los IDs
            const { data } = await acdemycApi.put(`/calendar/${CalendarId}`, { ...calendarUpdate });

            //? Si todo sale bien se muestra el mensaje de que el usuario se agrego correctamente
            Swal.fire({
                title: "Usuario Agregado correctamente",
                icon: 'success'
            })

            //?Cambiamos los valores en la store enviandole los nuevos users y el calendario que se selecciono
            dispatch(onSelectCalendarEvent({ events, calendario: data.calendario }))

        } catch (error) {
            console.log('Error Cargando eventos')
            console.log(error)
            console.log(error.response)
        }

    }
    //*Funcion para actualizar el calendario -Eliminar usuario
    const startUpdateCalendar = async ({ calendar, CalendarId, deleteUser = false, deleteUserCalendar = false }) => {

        try {

            //?Uso en botones, recordar descativarlo en el dispatch base
            dispatch(onLoading());

            const { calendarEvent, userPrimary } = calendar;

            //*Calendario modificado solo con IDS
            const calendarUpdate = {
                CalendarId,
                calendarEvent: {
                    nameCalendarEvent: calendarEvent.nameCalendarEvent,
                    events: calendarEvent.events.map(event => event.id),
                    users: calendarEvent.users.map(users => {
                        return {
                            accept: users.accept,
                            user: users.user.uid
                        }
                    })
                },
                userPrimary: userPrimary._id,
            }

            //*Una vez actualizado el calendario ejecutamos el llamado a la API
            //? Editando CALENDARIO
            await acdemycApi.put(`/calendar/${CalendarId}`, calendarUpdate);

            if (deleteUserCalendar) {

                //*Si es denied ejecutamos la eliminacion del calendario en la store quitandolo de la lista
                const calendarListUpdate = calendarList.filter(calendar => calendar.CalendarId !== CalendarId);

                //*Actualizamos la store con la lista de calendarios eliminando el que se denego
                dispatch(onUpdateCalendarList({ calendarList: calendarListUpdate, user }));
                //Este se ejecuta aqui porque delete user es true
                Swal.fire('Eliminacion completa', 'El calendario a sido Eliminado correctamente', 'success')
            } else {

                //*Primero de hace el cambio en el backEnd despues disparamos los eventos del store
                dispatch(onUpdateCalendar({ calendario: calendar }));
                if (deleteUser) {
                    Swal.fire('Usuario Eliminado', 'El/La Usuario sido eliminado exitosamente', 'success')
                } else {
                    Swal.fire('Modificacion completa', 'El calendario a sido Modificado correctamente', 'success')
                }
            }

            //*Cerramos el modal despues de la actualizacion o eliminacion
            //onCloseModalCalendar();

        } catch (error) {
            Swal.fire('Error al Modificar el calendario', 'Ocurrio un error inesperado contacte con administracion', 'error');
            console.log('Error al Modificar el calendario')
            console.log(error)
            console.log(error.response)
        }
    }
    //*Para la eliminacion del calendario
    const startDeletingCalendar = async ({ calendar, CalendarId }) => {

        const { calendarEvent, userPrimary } = calendar;

        try {

            //?Uso en botones, recordar descativarlo en el dispatch base
            dispatch(onLoading());

            //*Si es denied ejecutamos la eliminacion del calendario en la store quitandolo de la lista
            const calendarListUpdate = calendarList.filter(calendar => calendar.CalendarId !== CalendarId);

            await acdemycApi.delete(`/calendar/${CalendarId}`);
            Swal.fire('Eliminado correctamente', 'El Calendario a sido eliminado correctamente', 'success')

            //*Actualizamos la store con la lista de calendarios eliminando el que se denego
            dispatch(onUpdateCalendarList({ calendarList: calendarListUpdate, user }));
            //onCloseModalCalendar();

        } catch (error) {
            console.log('Error Al Eliminar el calendario')
            console.log(error)
            console.log(error.response)
        }

    }

    return {
        //*Property
        events,
        isLoading,
        activeEvent,
        calendarActive,
        calendarList,
        hasEventSelected: !!activeEvent,

        //*metodos
        setActiveEvent,
        startDeletingEvent,
        startDeletingOrAcceptCalendar,
        startLoadingEvents,
        startLoadingEventsCalendar,
        startSavingCalendarEvent,
        startSavingEvent,
        startAddNewUserCalendar,
        startUpdateCalendar,
        startDeletingCalendar,
        startLoadingCalendarList,
    }
}
