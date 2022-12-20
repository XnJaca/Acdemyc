
import Swal from 'sweetalert2'
import React from 'react'
import { useAuthStore, useForm } from '../../../hooks';

const loginFormFields = {
    password: '',
    password2: '',
}

export const ChangePasswordPage = () => {

    const {startChangePassword } = useAuthStore();
    const { password, password2, onInputChange } = useForm(loginFormFields);

    const onChangePassword = (e) => {
        e.preventDefault();

        //datos de pasado rapido

        startChangePassword(password); 
        return;
        
        if (password.length < 8) {
            e.target.password.className += ' is-invalid'
            Swal.fire('Error en la autenticacion', "La contraseña debe ser mayor o igual a 8 digitos", 'error');
            return;
        } else {
            e.target.password.className = ' form-control'
        }

        if (password !== password2) {

            if (!e.target.password.className.includes('is-invalid')) {
                e.target.password.className += ' is-invalid'
                e.target.password2.className += ' is-invalid'
            }
            Swal.fire('Error en la autenticacion', "Las contraseñas no son iguales", 'error');

            return;

        } else {
            e.target.password.className = ' form-control'
            e.target.password2.className = ' form-control' 
        }

        if(password.includes('-')){
            e.target.password.className += ' is-invalid'
            Swal.fire('Error en la autenticacion', "La contraseña no puede contener guiones", 'error');
            return;
        }else{
            e.target.password.className = ' form-control'
        }

        startChangePassword(password); 

    }

    return (

        <div className="login-form-bg h-100">
            <div className="container h-100">
                <div className="row justify-content-center h-100">
                    <div className="col-xl-6">
                        <div className="form-input-content">
                            <div className="card login-form mb-0">
                                <div className="card-body pt-5">
                                    <div className='d-flex justify-content-center mb-3'>
                                        <img className='icon_w_100' src="/500x500-bg-transparent.png" alt="AcdemycIcon" />
                                    </div>
                                    <a className="text-center" href="#"> <h4>Cambio de Contraseña</h4></a>
                                    <form onSubmit={onChangePassword} className="mt-5 mb-3 login-input needs-validation">
                                        <div className="form-group">
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Contraseña"

                                                onChange={onInputChange}
                                                name='password'
                                                value={password}
                                            />
                                            <input
                                                type="password"
                                                className="form-control "
                                                placeholder="Repita la Contraseña"

                                                onChange={onInputChange}
                                                name='password2'
                                                value={password2}
                                            />
                                        </div>
                                        <button className="btn login-form__btn submit w-100">Cambiar Contraseña</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
