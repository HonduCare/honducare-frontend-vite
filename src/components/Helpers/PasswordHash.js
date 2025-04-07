const bcrypt = require('bcrypt');

const encriptarContrasena = async (contrasena) => {
    const saltRounds = 10;
    return await bcrypt.hash(contrasena, saltRounds);
};

const verificarContrasena = async (contrasenaIngresada, hashAlmacenado) => {
    return await bcrypt.compare(contrasenaIngresada, hashAlmacenado);
};

module.exports = {
    encriptarContrasena,
    verificarContrasena
};