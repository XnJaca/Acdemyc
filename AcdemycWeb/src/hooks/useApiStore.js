import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import acdemycApi from "../api/acdemycApi";

import {
    onLoad,
    onGetData,
    onUpdateData,
    onAddNewData,
    onCloseLoad,
} from "../store";

export const useApiStore = () => {

    const { status, data, isError } = useSelector(state => state.api);

    const dispatch = useDispatch();

    //* El tipo es lo que quiero que me devuelva, si es result o data
    //* Guarda la data en la store
    const onGetAllUser = async ({ url, tipo, filter = {} }) => {

        dispatch(onLoad());

        //* Si el filter tiene algo, entonces ejecuta el cambio de la data con el filtro
        //* caso contrario, hace el llamado normalmente
        if (Object.keys(filter).length > 0) {

            //* Si el tipo es un string vacio, entonces significa que es un peidido de uno de largo
            //* osea que el tipo es el primero
            if (filter.tipoSecondario === "") {
                await acdemycApi.get(url).then((val) => {
                    let data = val.data[tipo];

                    let dataUpdate = data.filter(value => (value[filter.tipo] === filter.filter));

                    dispatch(onGetData(
                        dataUpdate.map((val) => {
                            return {
                                id: val.fk_usuario,
                                nombre: val.usuario.nombre,
                                apellidos: val.usuario.apellidos,
                                cedula: val.usuario.cedula,
                                email: val.usuario.email,
                                celular: val.usuario.celular,
                                rol_administrador: val.rol_administrador.descripcion,
                                fk_rol_administrador: val.fk_rol_administrador,
                            }
                        })
                    ));
                }).catch((error) => {
                    console.log(error);
                    Swal.fire('error', 'Error al cargar los datos', 'error');
                });

            } else {
                //* Caso contrario el filtro tiene una una profundidad de 2
                //* y se ejecuta de esa manera
                await acdemycApi.get(url).then((val) => {
                    let data = val.data[tipo];

                    let dataUpdate = data.filter(value => (value[filter.tipo][filter.tipoSecondario] === filter.filter));

                    dispatch(onGetData(
                        dataUpdate.map((val) => {
                            return {
                                id: val.fk_usuario,
                                nombre: val.usuario.nombre,
                                apellidos: val.usuario.apellidos,
                                cedula: val.usuario.cedula,
                                email: val.usuario.email,
                                celular: val.usuario.celular,
                                rol_administrador: val.rol_administrador.descripcion,
                                fk_rol_administrador: val.fk_rol_administrador,
                            }
                        })
                    ));
                }).catch((error) => {
                    console.log(error);
                    Swal.fire('error', 'Error al cargar los datos', 'error');
                });
            }

        } else {
            //* Significa que es un pedido normal como cualquier otro y no tiene filter ni nada de eso
            await acdemycApi.get(url).then((val) => {
                console.log(val.data[tipo])
                let data = val.data[tipo];
                dispatch(onGetData(
                    data.map((val) => {
                        return {
                            id: val.fk_usuario,
                            nombre: val.usuario.nombre,
                            apellidos: val.usuario.apellidos,
                            cedula: val.usuario.cedula,
                            email: val.usuario.email,
                            celular: val.usuario.celular,
                            rol_administrador: val?.rol_administrador?.descripcion ?? '',
                            fk_rol_administrador: val?.fk_rol_administrador ?? '',
                            tipo_usuario: val?.tipo_usuario_x_usuario?.fk_tipo_usuario ?? '',
                        }
                    })
                ));
            }).catch((error) => {
                console.log(error);
                Swal.fire('error', 'Error al cargar los datos', 'error');
            });

        }

        console.log('Llamado a la API');
    };

    //* Metodo que funciona para que returne ese valor hacia donde se quiere
    //* y no directamente a la store
    //* si es result o data
    const onGetDataValue = async ({ url, tipo = '' }) => {

        var data;
        await acdemycApi.get(url).then((val) => {
            tipo === '' ? data = val.data : data = val.data[tipo];
        }).catch((error) => {
            console.log(error);
        });

        console.log('Llamado a la API funcion onGetDataValue');
        return data;
    };

    //* Metodo para guardar un usuario recibiendo la url y la data a guardar
    const onSaveUser = async ({ url, dataSave }) => {
        // dispatch(onLoad());


        const { usuario, tipo_usuario, administrador } = await acdemycApi.post(url, dataSave).then((val) => {
            return val.data.result;
        }).catch((error) => {
            const errores = error.response.data.errors;
            const msgArray = errores.map(value => value.msg);
            Swal.fire('Error', msgArray.join('<br/><br/>'), 'error');
        });

        //! Esto es como para cargarlo al data nuevamente, pero hay que verificar
        //! si el tipo actual que podria ser DIRECTOR y entonces no deberia agregarlo

        // dispatch(onAddNewData({
        //     id: usuario.id,
        //     nombre: usuario.nombre,
        //     apellidos: usuario.apellidos,
        //     cedula: usuario.cedula,
        //     email: usuario.email,
        //     celular: usuario.celular,
        //     rol_administrador: "COORDINADOR TECNICO",
        //     fk_rol_administrador: administrador.fk_rol_administrador,
        // }));
        // console.log('Llamado a la API de editar');

        Swal.fire('Guardado', 'Usuario Guardado Correctamente', 'success')


    }

    const onEditUser = async ({ url, dataEdit, tipo, deleteStore = false }) => {

        dispatch(onLoad());
        try {

            //* actualizamos el dato en la base de datos
            //* esto devuelve el usuario editado 
            var dataUpdate = await acdemycApi.put(url, dataEdit).then((val) => {
                return val.data.result;
            }); 
            const { usuario } = dataUpdate;

            if (!deleteStore) {
                //* y actualizamos el dato en el store de redux  
                let dataUpdate = data.map(value => {
                    if (value.id === usuario.id) {
                        return { 
                            id: usuario.id,
                            nombre: usuario.nombre,
                            apellidos: usuario.apellidos,
                            cedula: usuario.cedula,
                            email: usuario.email,
                            celular: usuario.celular,
                            rol_administrador: dataUpdate?.rol_administrador?.descripcion,
                            fk_rol_administrador: dataUpdate?.rol_administrador?.id,
                        };
                    } else {
                        return value;
                    }
                });

                //
                dispatch(onUpdateData(dataUpdate));
            } else {
                //* y actualizamos el dato en el store de redux  
                let dataUpdate = data.filter(value => value.id !== usuario.id);

                dispatch(onUpdateData(dataUpdate.map(value => {
                    return {
                        //!POR MIENTRAS se acomoda lo de la api
                        ...value,
                        id: usuario.id,
                        nombre: usuario.nombre,
                        apellidos: usuario.apellidos,
                        cedula: usuario.cedula,
                        email: usuario.email,
                        celular: usuario.celular,
                        rol_administrador: rol_administrador.descripcion,
                        fk_rol_administrador: rol_administrador.id,
                    };
                })));
            }

            console.log('Llamado a la API de editar');
            Swal.fire('Guardado', 'Usuario editado correctamente', 'success')

        } catch (error) {
            Swal.fire('Error', 'Error al editar', 'error')
            dispatch(onGetData(data));
        }
    }

    const onEditData = async ({ url, dataEdit }) => {

        dispatch(onLoad());

        await acdemycApi.put(url, dataEdit).then().catch((error) => {
            console.log(error);
        });

        dispatch(onCloseLoad());
        console.log('Llamado a la API funcion onEditData');
    }


    return {
        //Constantes
        data,
        status,
        isError,

        //Metodos
        onGetAllUser,
        onEditUser,
        onGetDataValue,
        onSaveUser,
        onEditData,
    }
}
