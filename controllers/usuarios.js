// const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req, res) => {
  // const { nombre = "No Name", apikey } = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(desde).limit(Number(limite)),
  ]);
  res.status(201).json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res) => {
  //asi capturamos el body(informacion) de la solicitud
  const { nombre, correo, password, rol } = req.body;

  //creamos una instancia del modelo usuario.js para enviar informacion a la bd de mongo, y con destructuring  capturamos los datos que nos interesan de la req.body, asi se evita que se puedan manipular otros campos que esten en el modelo pero que no queramos que se cambien ni manipulen.
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en BD
  //se debe salvar la informacion para que mongo la grabe en la bd
  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosPut = async (req, res) => {
  //capturara un parametro de segmento que viene en la solicitud
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //validar contra BD
  if (password) {
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  //actualizamos el registro
  const usuario = await Usuario.findOneAndUpdate(id, resto);

  return res.json(usuario);
};

const usuariosPatch = (req, res) => {
  res.json({
    ok: true,
    msg: "patch API- CONTROLADOR",
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  //forma correcta de borrar un registro cambiando su estado
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json(usuario);
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
