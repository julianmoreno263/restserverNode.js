const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true, // para evitar que hayan nombres duplicados
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

//metodo para sobreescribir el metodo .toJSON y asi capturara campos que no quiero que se vean en la res de las consultas
CategoriaSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();

  return data;
};

module.exports = model("Categoria", CategoriaSchema);
