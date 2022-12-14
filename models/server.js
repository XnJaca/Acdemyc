
const express = require('express');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosPath = '/api/usuarios';

        //Middleware
        //Siempre se ejecuta cuando se levanta el servidor
        this.middlewares();
        //Rutas de mi aplicación
        this.routes();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Parseo y lectura del body a formato json
        this.app.use(express.json())

        // Directorio Publico
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/users_routes'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor en linea, Puerto ${this.port}`)
        })
    }
}

module.exports = Server;