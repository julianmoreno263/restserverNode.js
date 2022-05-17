const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");
const { existeProducto, existeCategoria } = require("../helpers/db-validators");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const router = Router();

//obtener todas los productos
router.get("/", obtenerProductos);

//obtener un producto por id
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
);

//crear un producto - privado- cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id de Mongo válido").isMongoId(),
    check("categoria").custom(existeCategoria),
    validarCampos,
  ],
  crearProducto
);

//actualizar un producto - privado- cualquier persona con un token valido
router.put(
  "/:id",
  [
    validarJWT,
    // check("id", "No es un id de Mongo válido").isMongoId(),
    validarCampos,
    check("id").custom(existeProducto),
    validarCampos,
  ],
  actualizarProducto
);

//borrar un producto - solo si es admin - pasa de estado true a false
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
