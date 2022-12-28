const express = require('express');
const cors = require('cors');
//TODO: INTENTAR LLAMAR AL DOTENV DESDE AQUI

class Server {
        constructor() {
            this.app = express();
            this.port = process.env.PORT;

            this.authPath = '/api/auth';
            this.usuariosPath = '/api/usuarios';
            this.roladministradorPath = '/api/roladministrador';
            this.estudiantesPath = '/api/estudiantes';
            this.institucionesPath = '/api/instituciones';
            this.administradorPath = '/api/administrador';
            this.profesoresPath = '/api/profesores';
            this.tipo_institucionPath = '/api/tipoinstitucion';

            // Middlewares
            this.middlewares();
    
            // Rutas de mi aplicación
            this.routes();
        }
    
        middlewares() {
    
            // CORS
            this.app.use( cors() );
    
            // Lectura y parseo del body
            this.app.use( express.json() );
    
            // Directorio público
            this.app.use( express.static('public') );
        }
    
        routes() {
            this.app.use( this.authPath, require('./routes/auth_route') );
            this.app.use( this.usuariosPath, require('./routes/usuarios/usuario_route') );
            this.app.use( this.roladministradorPath, require('./routes/roles/rol_administrador_route') );
            this.app.use( this.estudiantesPath, require('./routes/usuarios/estudiante_route') );
            this.app.use( this.administradorPath, require('./routes/usuarios/administrador_route') );
            this.app.use( this.profesoresPath, require('./routes/usuarios/profesor_route') );
            this.app.use( this.institucionesPath, require('./routes/instituciones/institucion_route') );
            this.app.use( this.tipo_institucionPath, require('./routes/instituciones/tipo_institucion_route') );
        }
    
        listen() {
            this.app.listen( this.port, () => {
                console.log('Servidor corriendo en puerto', this.port);
            });
        }
}

module.exports = Server;