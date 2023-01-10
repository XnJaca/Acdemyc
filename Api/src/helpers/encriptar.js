const bycript = require('bcryptjs');

// MEtodo para encriptar un string
const encriptar = async (string) => {
    const claveEncriptada = await bycript.hash(string, 10);
    return claveEncriptada;
}

// MEtodo para comparar un string con un hash
const comparar = async (string, hash) => {
    const comparacion = await bycript.compare(string, hash);
    return comparacion;
}

// Exportamos los metodos
module.exports = {
    encriptar,
    comparar
}

