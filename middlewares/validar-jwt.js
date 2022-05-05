const { response } = require("express");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  //validamos si si enviamos un token en la peticion
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición!!",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //leer el usuario que corresponde al uid y verificar si el usuario existe en la BD
    const usuario = await Usuario.findById(uid);

    if(!usuario){
      return res.status(401).json({
        msg: "Token no válido - usuario no existe en la BD"
      })
    }

    //Validar si el usuario tiene estado en true
    if(!usuario.estado){
      return res.status(401).json({
        msg: "Token no válido - usuario con estado en false"
      })
    }


    req.usuario = usuario;

    next();
  } catch (error) {}

  console.log(token);
};

module.exports = {
  validarJWT,
};
