import { Link } from "react-router-dom"

export const InfoUserContent = () => {

  //se hace llamado a la api cada vez que se cargue este componente y actualizamos los datos


  return ( 
    <div className="container-fluid mt-3"> 
      <div className="row"> 
        <div className="col-lg-3 col-sm-6">
          <Link to={"admin"} className="card gradient-1 w-100">
            <div className="card-body">
              <h3 className="card-title text-white">Admins</h3>
              <div className="d-inline-block">
                <h2 className="text-white">1</h2>
                <p className="text-white mb-0"></p>
              </div>
              <span className="float-right display-5 opacity-5"><i className="fa fa-solid fa-lock"></i></span>
            </div>
          </Link>
        </div>
        
        <div className="col-lg-3 col-sm-6">
          <Link to={'profesores'} className="card gradient-2">
            <div className="card-body">
              <h3 className="card-title text-white">Profesores</h3>
              <div className="d-inline-block">
                <h2 className="text-white">12</h2>
                <p className="text-white mb-0"></p>
              </div>
              <span className="float-right display-5 opacity-5"><i className="fa fa-solid fa-users"></i></span>
            </div>
          </Link>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="card gradient-3">
            <div className="card-body">
              <h3 className="card-title text-white">Estudiantes</h3>
              <div className="d-inline-block">
                <h2 className="text-white">200</h2>
                <p className="text-white mb-0"></p>
              </div>
              <span className="float-right display-5 opacity-5"><i className="fa fa-solid fa-graduation-cap"></i></span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="card gradient-4">
            <div className="card-body">
              <h3 className="card-title text-white">Materias</h3>
              <div className="d-inline-block">
                <h2 className="text-white">12</h2>
                <p className="text-white mb-0"></p>
              </div>
              <span className="float-right display-5 opacity-5"><i className="fa fa-solid fa-book"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}
