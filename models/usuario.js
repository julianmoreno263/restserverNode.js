/*
     ASI SERA COMO QUEREMOS QUE SE GRABEN LOS DATOS EN LA COLECCION DE LA BD DE MONGO 
    {
        nombre: "serr",
        correo: "gahahah@adad",
        password: "373645454545"//estara encripatdo
        img: "hgu77575757",
        rol: "5757577575",
        estado: false(si esta marcado como eliminado sera false, o true soi esta habilitado)
        google:true(si el usuario fue creado por goolge sera true o false si fue creado por mi sistema de utenticacion)
    }


*/

const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true, //para no pasar correos repetidos
  },
  password: {
    type: String,
    required: [true, "El password es obligatorio"],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
    emun: ["ADMIN_ROLE", "USER_ROLE"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

//metodo para sobreescribir el metodo .toJSON y asi capturara campos que no quiero que se vean en la res de las consultas
UsuarioSchema.methods.toJSON = function () {
  const { __v, password, ...usuario } = this.toObject();
  return usuario;
};

module.exports = model("Usuario", UsuarioSchema);
