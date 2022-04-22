// const { response } = require("express");

const usuariosGet = (req, res) => {
  const {nombre="No Name",apikey}=req.query;
  res.status(201).json({
    ok: true,
    msg: "get API- CONTROLADOR",
    nombre,apikey
  });
};

const usuariosPost = (req, res) => {
  //asi capturamos el body(informacion) de la solicitud
  const body=req.body;
  const {nombre,edad}=body


  res.json({
    ok: true,
    msg: "post API- CONTROLADOR",
    nombre,
    edad
  });
};

const usuariosPut = (req, res) => {
  //capturara un parametro de segmento que viene en la solicitud
  const {id}=req.params;
  res.json({
    ok: true,
    msg: "put API- CONTROLADOR",
    id
  });
};

const usuariosPatch = (req, res) => {
  res.json({
    ok: true,
    msg: "patch API- CONTROLADOR",
  });
};

const usuariosDelete = (req, res) => {
  res.json({
    ok: true,
    msg: "delete API- CONTROLADOR",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
