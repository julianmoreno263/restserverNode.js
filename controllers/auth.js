const { response, json } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const { DefaultTransporter } = require("google-auth-library");

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

//controlador para validar si se recibe el token de google
const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    //aqui preguntamos si el usuario no existe entonces lo creamos
    if (!usuario) {
      //tengo que crearlo
      const data = {
        nombre,
        correo,
        rol: DefaultTransporter,//le asigna un rol por default
        password: ":)",
        img,
        google: true,
      };

      usuario = new Usuario(data);
      //guardamos este usuario en la bd
      await usuario.save();
    }

    //preguntamos si el usuario tiene estado false en la BD,entonces no le permitimos autenticarse
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Estado en false, hable con el admin, usuario está bloqueado!!",
      });
    }

    //despues de estas validaciones si todo esta bien,se genera el token de nuestro backend para el usuario
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "Todo bien",
     usuario,
     token
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar!!",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
