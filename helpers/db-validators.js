const { response } = require("express");
const { Categoria, Producto } = require("../models");
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

//verificar si el id del usuario existe
const idExiste = async (id = "") => {
  const existeId = await Usuario.findById(id);
  if (!existeId) {
    throw new Error(`El id ${id} no existe en la BD!!`);
  }
};

//verificar si el id de la categoria existe
const existeCategoria = async (id = "") => {
  const existeId = await Categoria.findById(id);
  if (!existeId) {
    throw new Error(`El id ${id} no existe en la BD!!`);
  }
};

//verificar si el id del producto existe
const existeProducto = async (id = "") => {
  const existeId = await Producto.findById(id);
  if (!existeId) {
    throw new Error(`El id ${id} no existe en la BD!!`);
  }
};

module.exports = {
  esRolValido,
  emailExiste,
  idExiste,
  existeCategoria,
  existeProducto,
};
