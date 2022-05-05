const { response } = require("express");

const esAdminRole = (req, res, next) => {
  if (!req.usuario) {
    res.status(500).json({
      msg: "Se quiere verificar el role sin validar primero el token!! ",
    });
  }

  const { rol, nombre } = req.usuario;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${nombre} no es administrador!! - No puede borrar registros!!`,
    });
  }

  next();
};

//middleware que valida si un usuario tiene varios roles

const tieneVariosRoles = (...roles) => {
  return (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el role sin validar primero el token!!",
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  esAdminRole,
  tieneVariosRoles,
};
