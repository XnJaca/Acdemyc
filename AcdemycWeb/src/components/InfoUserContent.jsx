import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2";
import { useApiStore, useAuthStore } from "../hooks"

export const InfoUserContent = () => {

  const { tipoUsuario } = useAuthStore();
  const { onGetDataValue } = useApiStore();

  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalProfesores, setTotalProfesores] = useState(0);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [totalMaterias, setTotalMaterias] = useState(0);

  //
  const totalCounts = async () => {
    Promise.all([
      onGetDataValue({ url: '/administradores?estado=1', tipo: 'administradores' }),
      //onGetDataValue({ url: '/estudiantes', tipo: 'estudiantes' })
    ]).then(values => {
      setTotalAdmins(values[0].length);
      //setTotalEstudiantes(values[1]);
    }).catch(err => {
      Swal.fire('Error', "Ocurrio un error, por favor hable con el administrador", 'error');
    });
  }

  console.log(totalAdmins)

  useEffect(() => {
    totalCounts();
  })



  // console.log(tipoUsuario)

  //se hace llamado a la api cada vez que se cargue este componente y actualizamos los datos
  // useEffect(() => {
  //   first

  //   return () => {
  //     second
  //   }
  // }, [third])


  return (
    <div className="container-fluid mt-3">
      <div className="row">

        {
          tipoUsuario.rolAdmin === 'DIRECTOR' && (
            <div className="col-lg-3 col-sm-6">
              <Link to={"admin"} className="card gradient-1 w-100">
                <div className="card-body">
                  <h3 className="card-title text-white">Admins</h3>
                  <div className="d-inline-block">
                    <h2 className="text-white">{totalAdmins}</h2>
                    <p className="text-white mb-0"></p>
                  </div>
                  <span className="float-right display-5 opacity-5"><i className="fa fa-solid fa-lock"></i></span>
                </div>
              </Link>
            </div>
          )
        }




        <div className="col-lg-3 col-sm-6">
          <Link to={'profesores'} className="card gradient-2">
            <div className="card-body">
              <h3 className="card-title text-white">Profesores</h3>
              <div className="d-inline-block">
                <h2 className="text-white">{totalProfesores}</h2>
                <p className="text-white mb-0"></p>
              </div>
              <span className="float-right display-5 opacity-5"><i className="fa fa-solid fa-users"></i></span>
            </div>
          </Link>
        </div>
        <div className="col-lg-3 col-sm-6">
          <Link to={'estudiantes'} className="card gradient-3">
            <div className="card-body">
              <h3 className="card-title text-white">Estudiantes</h3>
              <div className="d-inline-block">
                <h2 className="text-white">{totalEstudiantes}</h2>
                <p className="text-white mb-0"></p>
              </div>
              <span className="float-right display-5 opacity-5"><i className="fa fa-solid fa-graduation-cap"></i></span>
            </div>
          </Link>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="card gradient-4">
            <div className="card-body">
              <h3 className="card-title text-white">Materias</h3>
              <div className="d-inline-block">
                <h2 className="text-white">{totalMaterias}</h2>
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