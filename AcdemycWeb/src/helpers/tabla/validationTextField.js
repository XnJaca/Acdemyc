
//* Validaciones base
export const validateRequired = (value) => !!value.length;
export const validateRequiredNumber = (value) => Number.isInteger(value);
export const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
export const validateAge = (age) => age >= 18 && age <= 50;


//* Uso de las validaciones en cada columna y cuando se cree el edit de la tabla
// export const editTextFieldProps = useCallback(
//     (cell) => {
//         return {
//             error: !!validationErrors[cell.id],
//             helperText: validationErrors[cell.id],
//             //* El onBlur es un evento que sucede cuando el usuario sale de un input
//             onBlur: (event) => {
//                 //* La celda es el valor actual del input, se selecciona por el id
//                 //* El id seria el nombre o la key de la base de datos
//                 const isValid =
//                     cell.column.id === 'Email'
//                         //* Esta funcion evalua si tiene los datos correctos para un correo
//                         ? validateEmail(event.target.value)
//                         : cell.column.id === 'age'
//                             //* Esta funcion evalua si la edad esta determinada de un rango a otro
//                             ? validateAge(event.target.value)
//                             //* Esta funcion evalua si esta vacia el target actual
//                             : validateRequired(event.target.value);
//                 if (!isValid) {
//                     //* Coloca el valor de la celda en el objeto de errores
//                     setValidationErrors({
//                         ...validationErrors,
//                         [cell.id]: `${cell.column.columnDef.header} Es requerido`,
//                     });
//                 } else {
//                     //* Remueve el valor del error si todo esta correcto
//                     delete validationErrors[cell.id];
//                     setValidationErrors({
//                         ...validationErrors,
//                     });
//                 }
//             },
//         };
//     },
//     [validationErrors],
// );


//* Uso de las validaciones en cada columna y cuando se cree el add de la tabla
 //* Uso de las validaciones en cada columna y cuando se cree el edit de la tabla
export const editTextFieldProps = ({cell,validationErrors,setValidationErrors}) => {
    return {
      error: !!validationErrors[cell.id],
      helperText: validationErrors[cell.id],
      //* El onBlur es un evento que sucede cuando el usuario sale de un input
      onBlur: (event) => {
        //* La celda es el valor actual del input, se selecciona por el id
        //* El id seria el nombre o la key de la base de datos
        const isValid =
          cell.column.id === 'Email'
            //* Esta funcion evalua si tiene los datos correctos para un correo
            ? validateEmail(event.target.value)
            : cell.column.id === 'age'
              //* Esta funcion evalua si la edad esta determinada de un rango a otro
              ? validateAge(event.target.value)
              //* Esta funcion evalua si esta vacia el target actual
              : validateRequired(event.target.value);
        if (!isValid) {
          //* Coloca el valor de la celda en el objeto de errores
          setValidationErrors({
            ...validationErrors,
            [cell.id]: `${cell.column.columnDef.header} Es requerido`,
          });
        } else {
          //* Remueve el valor del error si todo esta correcto
          delete validationErrors[cell.id];
          setValidationErrors({
            ...validationErrors,
          });
        }
      },
    };
  };