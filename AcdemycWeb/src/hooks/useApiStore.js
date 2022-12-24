import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import acdemycApi from "../api/acdemycApi";

import {
    onLoad,
    onGetData,
    onUpdateData, 
} from "../store";

export const useApiStore = () => {

    const { status, data, isError } = useSelector(state => state.api);

    const dispatch = useDispatch();

    const onGetAll = async (url) => {

        dispatch(onLoad());

        await acdemycApi.get(url).then((val) => {
            const dataPrueba = val.data.users;
            dataPrueba.map((val) => {
                val.tipoAdministrador = 'Administrador'
            }); 
            dispatch(onGetData(dataPrueba));
        }).catch((error) => {
            console.log(error);
            //? dispatch(onError(error));
        });



        // const response = await acdemycApi.get(url).then(val => {
        //     //* Devolvemos el array de objetos pero con los datos especificos de la tabla
        //     return val.data.users.map((val) => {
        //         return {
        //             Nombre: val.Nombre,
        //             Apellido_1: val.Apellido_1,
        //             Apellido_2: val.Apellido_2,
        //             Email: val.Email,
        //             Telefono: val.Telefono,
        //         }
        //     })
        // }).catch((_) => errorLoadData('Error al cargar los datos'));


        console.log('Llamado a la API');
    };


    const onEdit = async (url, dataEdit) => {

        dispatch(onLoad());
        try {

            //* actualizamos el dato en la base de datos
            //* esto devuelve el usuario editado 
            var userUpdate = await acdemycApi.put(url, dataEdit).then((val) => val.data.user);

            //* y actualizamos el dato en el store de redux  
            var dataUpdate = data.map(value => {

                if (value.ID === userUpdate.ID) {
                    return userUpdate;
                } else {
                    return value;
                }
            });

            dispatch(onUpdateData(dataUpdate));
            console.log('Llamado a la API de editar');
        } catch (error) {
            Swal.fire('Error', 'Error al editar', 'error')
            dispatch(onGetData(data));
        }
    }


    return {
        //Constantes
        data,
        status,
        isError,

        //Metodos
        onGetAll,
        onEdit,

    }
}
