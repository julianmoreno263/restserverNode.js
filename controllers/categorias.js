const { response } = require("express");
const { Categoria } = require("../models/index");

//obtenerCategorias - paginado -total - populate
const obtenerCategorias = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .skip(desde)
      .limit(Number(limite)),
  ]);
  res.status(201).json({
    total,
    categorias,
  });
};

//obtenerCategoria - por el _id de mongo - populate {}
const obtenerCategoria = async (req, res) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  if (categoria) {
    res.json({ categoria });
  } else {
    res.status(400).json({
      msg: `La categoria con id ${id} no existe en la BD!!`,
    });
  }
};

//crear categoria
const crearCategoria = async (req, res = response) => {
  //el nombre de la categoria debera ser en mayusculas, lo capitalizo
  const nombre = req.body.nombre.toUpperCase();

  //capturamos una categoria por su nombre, se debe usar el modelo
  const categoriaDB = await Categoria.findOne({ nombre });

  //validamos si existe o no la categoria, aqui se interpreta
  if (categoriaDB)
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe en la BD`,
    });

  //Generar data permitida el modelo de usuario para ser grabada en la BD, este sera el objeto que se insertara en la BD,aqui estamos usando el modelo de Usuarios porque en la data indicamos que queremos ver en la respuesta el _id del usuario que crea mongo para saber que usuario creo la respectiva categoria.
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  //Grabar la data en la BD
  const categoria = new Categoria(data);
  await categoria.save();

  res.status(201).json(categoria);
};

//actualizarCategoria - por el nombre
const actualizarCategoria = async (req, res = response) => {
  //capturara un parametro de segmento que viene en la solicitud
  const { id } = req.params;
  //sacamos de la data lo que no queremos que el usuario que actualize la categoria manipule
  const { estado, usuario, ...data } = req.body;
  //grabamos el nombre de la categoria en uppercase
  data.nombre = data.nombre.toUpperCase();
  //aqui capturo el usuario que hizo la modificacion por su id de mongo
  data.usuario = req.usuario._id;

  //actualizamos el registro
  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  return res.json(categoria);
};

//borrarCategoria - estado:false
const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;

  //forma correcta de borrar un registro cambiando su estado
  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(categoria);
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
