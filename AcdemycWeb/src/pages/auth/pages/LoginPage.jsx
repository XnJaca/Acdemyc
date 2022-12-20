import React from 'react'
import { useAuthStore, useForm } from '../../../hooks'
 
const loginFormFields = {
    loginEmail: '',
    loginPassword: '',
} 

export const LoginPage = () => {

    const {startLogin} = useAuthStore();
 
    const { loginEmail, loginPassword, onInputChange: onLoginInputChange } = useForm(loginFormFields);
    
    const onRegisterSubmit = (e) => {
        e.preventDefault();
        console.log('Loggeando'); 
        startLogin({email: loginEmail, password: loginPassword, first: true});
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
                                    <a className="text-center" href="#"> <h4>Login</h4></a>
                                    <form onSubmit={onRegisterSubmit} className="mt-5 mb-5 login-input">
                                        <div className="form-group">
                                            <input 
                                            className="form-control" 
                                            placeholder="Email" 
                                            type="email" 
                                            name='loginEmail'
                                            value={loginEmail}
                                            onChange={onLoginInputChange}                                            />
                                        </div>
                                        <div className="form-group">
                                            <input 
                                            type="password" 
                                            className="form-control" 
                                            placeholder="Contraseña" 
                                            name='loginPassword'
                                            value={loginPassword}
                                            onChange={onLoginInputChange}  
                                            />
                                        </div>
                                        <button type="submit" className="btn login-form__btn submit w-100">Inciar Sesion</button>
                                    </form>
                                    <p className="mt-5 login-form__footer">No tienes Cuenta? <a href="#" className="text-primary">Crear Cuenta</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
