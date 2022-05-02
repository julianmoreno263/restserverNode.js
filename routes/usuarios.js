const { Router } = require("express");
const { check } = require("express-validator");
const {
  esRolValido,
  emailExiste,
  idExiste,
} = require("../helpers/db-validators");

const { validarCampos } = require("../middlewares/validarCampos");
const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
} = require("../controllers/usuarios");

const router = Router();

//obtener
router.get("/", usuariosGet);

//enviar
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio!!").not().isEmpty(),
    check(
      "password",
      "El password debe de tener más de 6 caracteres!!"
    ).isLength({ min: 6 }),
    check("correo", "El correo no es válido!!").isEmail(),
    // check("rol", "No es un rol permitido!!").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("correo").custom(emailExiste),
    check("rol").custom(esRolValido),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPost
);

//actualizar
router.put(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(idExiste),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPut
);

router.patch("/", usuariosPatch);

//borrar
router.delete(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(idExiste),
    
    validarCampos,
  ],

  usuariosDelete
);

module.exports = router;
