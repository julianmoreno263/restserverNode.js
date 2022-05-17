const { response } = require("express");
const { Producto } = require("../models/index");

//obtenerProductos - paginado -total - populate
const obtenerProductos = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(desde)
      .limit(Number(limite)),
  ]);
  res.status(201).json({
    total,
    productos,
  });
};

//obtenerProducto - por el _id de mongo - populate {}
const obtenerProducto = async (req, res) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json(producto);
};

//crear producto
const crearProducto = async (req, res = response) => {
  //saco del body lo que no quiero que el usuario pueda cambiar y mando lo demas
  const { estado, usuario, ...body } = req.body;

  //capturamos un producto por su nombre, se debe usar el modelo, y de una vez lo pasamos a upperCase(esto es opcional)pero lo pasamos de una vez a mayusculas porque si hacemos el upperCase mas adelante se Mongo lo toma en minuscula y como se graba en mayuscula no lo encuentra y tira un error.
  const productoDB = await Producto.findOne({
    nombre: body.nombre.toUpperCase(),
  });

  //validamos si existe o no el producto, aqui se interpreta
  if (productoDB)
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe en la BD`,
    });

  //Generar data permitida del modelo de usuario para ser grabada en la BD, este sera el objeto que se insertara en la BD,aqui estamos usando el modelo de Usuarios porque en la data indicamos que queremos ver en la respuesta el _id del usuario que crea mongo para saber que usuario creo la respectiva categoria, y enviamos tambien en la respuesta el resto de parametros que quiero que el usuario pueda cambiar, osea el ...body.
  const data = {
    ...body,
    nombre: body.nombre,
    usuario: req.usuario._id,
  };

  //Grabar la data en la BD
  const producto = new Producto(data);
  await producto.save();

  res.status(201).json(producto);
};

//actualizarProducto - por el nombre
const actualizarProducto = async (req, res) => {
  //capturara un parametro de segmento que viene en la solicitud
  const { id } = req.params;
  //sacamos de la data lo que no queremos que el usuario que actualize la categoria manipule
  const { estado, usuario, ...data } = req.body;

  if (data.nombre) {
    //grabamos el nombre de la categoria en uppercase
    data.nombre = data.nombre.toUpperCase();
  }

  //aqui capturo el usuario que hizo la modificacion por su id de mongo
  data.usuario = req.usuario._id;

  //actualizamos el registro
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  return res.json(producto);
};

//borrarProducto - estado:false
const borrarProducto = async (req, res) => {
  const { id } = req.params;

  //forma correcta de borrar un registro cambiando su estado
  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(producto);
};

//borramos una categoria

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
