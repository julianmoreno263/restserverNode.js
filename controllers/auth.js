const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar si el correo existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usario / Password no son correctos - correo no existe",
      });
    }

    //Verificar si el usuario esta activo en la BD
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usario / Password no son correctos - estado en false",
      });
    }

    //Verificar el password
    const validarPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validarPassword) {
      return res.status(400).json({
        msg: "Usario / Password no son correctos - password no existe",
      });
    }

    //Generar el jwt
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "Login ok!!",
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hubo un error",
    });
  }
};

module.exports = {
  login,
};
