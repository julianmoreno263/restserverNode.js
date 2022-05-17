const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

//funcion para poder buscar en el termino de busqueda d ela url por id de mongo del usuario o por el nombre de usuario
const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino); //TRUE

  //verifica si el termino de busqueda es un id de mongo
  if (esMongoId) {
    const usuario = await Usuario.findById(termino);//el termino sera el id de mongo valido
    return res.json({
      results: (usuario) ? [usuario] : []

    });
  }


  //expresion regular
  const regex = new RegExp(termino, "i")

  //si quiero que el termino de busqueda sea el nombre o el correo hago asi:
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }]
  });
  return res.json({
    results: usuarios
  });
};

//funcion para buscar en categorias 
const buscarCategorias = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino); //TRUE
  //verifica si el termino de busqueda es un id de mongo
  if (esMongoId) {
    const categoria = await Categoria.findById(termino).populate("usuario", "nombre");//el termino sera el id de mongo valido
    return res.json({
      results: (categoria) ? [categoria] : []
    });
  }

  //expresion regular
  const regex = new RegExp(termino, "i")

  //si quiero que el termino de busqueda sea el nombre y estado en true hago asi:
  const categorias = await Categoria.find({
    $and: [{ nombre: regex, estado: true }]
  }).populate("usuario", "nombre");
  return res.json({
    results: categorias
  });
};

//funcion para buscar en productos 
const buscarProductos = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino); //TRUE
  //verifica si el termino de busqueda es un id de mongo
  if (esMongoId) {
    const producto = await Producto.findById(termino).populate("categoria", "nombre");//el termino sera el id de mongo valido
    return res.json({
      results: (producto) ? [producto] : []

    });
  }

  //expresion regular
  const regex = new RegExp(termino, "i")

  //si quiero que el termino de busqueda sea el nombre y estado en true hago asi:
  const productos = await Producto.find({
    $and: [{ nombre: regex, estado: true }]
  }).populate("categoria", "nombre");
  return res.json({
    results: productos
  });
};



const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategorias(termino, res)
      break;
    case "productos":
      buscarProductos(termino, res)
      break;
    default:
      res.status(500).json({
        msg: "Se me olvido hacer esta busqueda",
      });
      break;
  }
};

module.exports = { buscar, buscarUsuarios };
