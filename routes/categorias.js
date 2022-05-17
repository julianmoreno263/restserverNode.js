const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/db-validators");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const router = Router();

/* url donde lanzaremos las rutas de categorias*/

//obtener todas las categorias
router.get("/", obtenerCategorias);

//obtener una categoria por id
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  obtenerCategoria
);

//crear una categoria - privado- cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//actualizar una registro - privado- cualquier persona con un token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id de Mongo válido").isMongoId(),
    validarCampos,
    check("nombre", "El nombre de la categoría es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  actualizarCategoria
);

//borrar una categoria - solo si es admin - pasa de estado true a false
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
