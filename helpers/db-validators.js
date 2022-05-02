const Role = require("../models/role");
const Usuario = require("../models/usuario");
//verificar el rol
const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD!!`);
  }
};

//verificar si el correo existe
const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya está registrado en la BD!!`);
  }
};

//verificar si el id existe
const idExiste = async (id = "") => {
  
  const existeId = await Usuario.findById(id);
  if (!existeId) {
    throw new Error(`El id ${id} no existe en la BD!!`);
  }
};

module.exports = {
  esRolValido,
  emailExiste,
  idExiste,
};
