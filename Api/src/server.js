//Require express
const express = require('express');
//Require cors
const cors = require('cors');
//Rquiere dotenv
require('dotenv').config();

//Create express server
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Llamamos a las rutas
        this.route_path = require('./routes/routes_paths');

        //Middlewares
        this.middlewares();

        //Routes
        this.routes();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Parse and read body
        this.app.use(express.json());

        //Public directory
        this.app.use(express.static('public'));
    }

    routes() {
        //Use route login
        this.app.use(this.route_path.login, require('./routes/auth/login'));
        //Use route register
        // this.app.use(this.route_path.register, require('./routes/auth/register'));
        //Use route usuarios
        this.app.use(this.route_path.usuarios, require('./routes/usuarios/usuarios'));
        //Use route administradores
        this.app.use(this.route_path.administradores, require('./routes/usuarios/administradores'));
        //Use route roladministrador
        // this.app.use(this.route_path.rolAdmin, require('./routes/usuarios/roladministrador'));
        //Use route estudiantes
        this.app.use(this.route_path.estudiantes, require('./routes/usuarios/estudiantes'));
        //Use route encargados
        this.app.use(this.route_path.encargados, require('./routes/usuarios/encargados'));
        //Use route profesores
        // this.app.use(this.route_path.profesores, require('./routes/usuarios/profesores'));
        //Use route tipoinstitucion
        // this.app.use(this.route_path.tipo_instituciones, require('./routes/instituciones/tipoinstitucion'));
        //Use route instituciones
        // this.app.use(this.route_path.instituciones, require('./routes/instituciones/instituciones'));
        //Use route cursos
        // this.app.use(this.routes.cursos, require('./routes/materias/cursos'));
        //Use route materias
        // this.app.use(this.route_path.materias, require('./routes/materias/materias'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}
module.exports = Server;