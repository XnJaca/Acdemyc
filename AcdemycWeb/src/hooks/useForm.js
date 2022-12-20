import { useEffect, useMemo, useState } from 'react';

//Primero se envia un valor inicial

//forma de useForm
/*
    const { loginEmail, loginPassword, onInputChange: onLoginInputChange } = useForm(loginFormFields);
    const {
        registerName, registerEmail,
        registerPassword2, registerPassword,
        onInputChange: onRegisterInputChange,
        onResetForm
    } = useForm(registerFormFields);

*/ 

export const useForm = (initialForm = {}, formValidations = {}) => {

    //el use state es una opcion que trae el mismo react para hacer cambios hacia constantes
    const [formState, setFormState] = useState(initialForm);
    const [formValidation, setFormValidation] = useState({})

    useEffect(() => {
        createValidators();
    }, [formState])


    //Si cambia algun dato del initial form se vuelve a invocar el formulario
    //esto para que pueda recargar el componente con nuevos datos
    useEffect(()=>{
        setFormState(initialForm)
    },[initialForm])


    const isFormvalid = useMemo(() => {
        
        for (const formValue of Object.keys(formValidation)) {
            if (formValidation[formValue] !== null) return false;
        }

        return true;
    }, [formValidation]) 


    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value
        });
    }
    //usamos el metodo de useState para darle el valor a los datos
    const onResetForm = () => {
        setFormState(initialForm);
    }

    const createValidators = () => {

        const formCheckedValues = {};

        //el key es para obtener el primer valor o nombre del valor del objeto
        for (const formField of Object.keys(formValidations)) {

            const [fn, errorMessage] = formValidations[formField];

            //creacion de un objeto mediante unos valores nuevos
            formCheckedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessage;
        }


        setFormValidation(formCheckedValues);
    }


    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,

        ...formValidation,
        isFormvalid
    }
}