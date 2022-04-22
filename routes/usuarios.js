const { Router } = require("express");
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
router.post("/", usuariosPost);

//actualizar
router.put("/:id", usuariosPut);

router.patch("/", usuariosPatch);

//borrar
router.delete("/", usuariosDelete);

module.exports = router;
