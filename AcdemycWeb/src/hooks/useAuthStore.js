import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2";
import acdemycApi from "../api/acdemycApi";
import { onCheking, onLogin, onLogout, onFirstLogin } from "../store";

export const useAuthStore = () => {

    const { status, user, errorMessage, tipoUsuario } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    //! First es de prueba ya que no se hace llamado hacia la api
    const startLogin = async ({ cedula, clave, first = false }) => {
        //Para un loading
        dispatch(onCheking());

        //* Primera verifica si es primera sesion de usuario, si lo es
        //* se coloca el status en 'firstLogin' y se le pide que cambie la contraseña
        //* si no es primera sesion se verifica la contraseña y se logea
        try {
            //*Se hace llamado a la api se obtienen los datos del usuario y token
            //https://acdemyc-production.up.railway.app/api/auth/login 
            cedula = '0000000000' //Administrador  0000000000 // otro  321654987 // esutdiante  123456789
            clave = '123456'
            const {usuario,token,tipo_usuario, rol_admin = null} = await acdemycApi.post('/login', { cedula, clave })
            .then( (val)=> {
                return { ...val.data.result, token: val.data.token }
            })
            .catch((error) => { Swal.fire('error', 'Error al iniciar sesion', 'error') });
            
            console.log(rol_admin)
            //! por mientras new-123456 
            var isNewUser = false;

            //? Si el usuario no existe se muestra un mensaje de error
            // Swal('Error', 'Usuario o contraseña incorrectos', 'error'); 

            //* Disparamos ejecutamos el llamado a la base de datos obtenemos la respuesta
            //* Si es correcta y la contrase;a inclute 'new-' es primera sesion 
            //* y lo tiramos a cambiar contrase;a de una


            if (isNewUser) { //and data trae datos
                //*Si fuera primera sesion se ejecuta el 
                dispatch(onFirstLogin({ ...user }));
            } else {
                dispatch(onLogin({ user: usuario, tipoUsuario: {...tipo_usuario, rolAdmin: rol_admin?.descripcion}}))
            }

            localStorage.setItem('token', token)
            localStorage.setItem('token-init-date', new Date().getTime());
            localStorage.setItem('fk_institucion', usuario.fk_institucion);
            localStorage.setItem('rol_admin', tipo_usuario.id);

            //colocar la informacion del usuario en el local storage porque no se puede colocar
            //directamente en el api porque se inicializa primero el api antes que el auth store
            //pero al peticion es antes
            localStorage.setItem('uid', usuario.id);

            //Esto hace el dispatch de login
            //dispatch(onLogin({ name: 'Paco', uid: '1' }))
        } catch (error) {
            console.log(error)
            dispatch(onLogout('Credenciales incorrectas'));
            // setTimeout(() => {
            //     dispatch(clearErrorMessage());
            // }, 300);
        }
    }

    //* Esto se hara para que si en alguna configuracion desea hacer el cambio pueda hacerlo
    //* El estatus quedaria igual, caso que sea un cambio en configuracion se mantiene el status igual
    //* Caso contrario se mantendria diferente
    //* esto se puede saber con el status actual del estudiante, si es 'firstLogin' o 'authenticated'
    const startChangePassword = async ({ password }) => {

        //* Busco el usuario en la base de datos y le cambio la contraseña
        //* En la base de datos se codifica la contraseña
        console.log('Cambio de contrase;a')
        //* Ejecutaria el llamado a la api, colocandole los valores nuevos

        //* Despues verifica si es primera sesion de usuario
        if (status === 'firstLogin') {

            //! Si fuera primera sesion debemos en la base de datos decir que ya se inicio sesion

            //*Si fuera primera sesion obtenemos le id 
            dispatch(onLogin({ cedula: user.cedula, email: user.email, uid: user.uid, typeUser: user.typeUser }))

            //todo: Se haria un dispatch de login
        } else {
            //todo: Se haria un dispatch de cambio de contrase'a
        }




    }

    const startRegister = async ({ name, email, password }) => {
        dispatch(onCheking());
        try {
            //const { data } = await calendarApi.post('/auth/new', { name, email, password });
            localStorage.setItem('token', 'data.token')
            localStorage.setItem('token-init-date', new Date().getTime());

            //colocar la informacion del usuario en el local storage porque no se puede colocar
            //directamente en el api porque se inicializa primero el api antes que el auth store
            //pero al peticion es antes
            localStorage.setItem('uid', data.uid);

            dispatch(onLogin({ name: data.name, uid: data.uid }))

        } catch (error) {
            const errorMessageFinal = error.response.data

            dispatch(onLogout(errorMessageFinal.msg));
            // setTimeout(() => {
            //     dispatch(clearErrorMessage());
            // }, 300);
        }
    }


    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');

        if (!token) return dispatch(onLogout());
        try {

            // cedula = '134000120210' //Administrador  134000120210 // otro  321654987
            // clave = '123456'
            // const {data} = await acdemycApi.post('auth/login', {cedula, clave}); 

            // dispatch(onLogin({user:data.usuario, tipoUsuario:data.tipo_usuario}))
            // return

            //const { data } = await acdemycApi.get('/auth/renew');

            const cedula = '0000000000' //Administrador  134000120210 // otro  321654987 // Estudiante 123456789
            const clave = '123456'
            const {usuario,token,tipo_usuario, rol_admin = null} = await acdemycApi.post('/login', { cedula, clave })
            .then( (val)=> {
                return { ...val.data.result, token: val.data.token }
            })
            .catch((error) => { Swal.fire('error', 'Error al iniciar sesion', 'error')});

            dispatch(onLogin({ user: usuario, tipoUsuario: {...tipo_usuario, rolAdmin: rol_admin?.descripcion}}))

            localStorage.setItem('token', token)
            localStorage.setItem('token-init-date', new Date().getTime());

        } catch (error) {
            console.log(error)
            localStorage.removeItem('token');
            localStorage.removeItem('token-init-date');
            dispatch(onLogout());
        }
    }

    const startLogout = () => {
        dispatch(onCheking());
        localStorage.removeItem('token');
        localStorage.removeItem('token-init-date');
        localStorage.removeItem('calendarSelected');
        dispatch(onLogout());
    }

    return {
        //* Propiedades
        status,
        user,
        errorMessage,
        tipoUsuario,

        //* Metodos
        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
        startChangePassword,
    }
}