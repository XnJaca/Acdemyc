import axios from 'axios';
// import { getEnvVariables } from '../helpers/getEnvVariable';

// const { VITE_API_URL } = getEnvVariables();

const acdemycApi = axios.create({//se cambia la variable para que sea local
    baseURL: 'https://acdemyc-production.up.railway.app/api'
    //baseURL: VITE_API_URL
}) 

//? Configurar interceptores
acdemycApi.interceptors.request.use(config => {
    
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token'),
        'fk_institucion': localStorage.getItem('fk_institucion'),
        'rol_admin': localStorage.getItem('rol_admin'),
    }
    return config;
})


export default acdemycApi;