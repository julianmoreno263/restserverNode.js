const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
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

  precio: {
    type: Number,
    default: 0,
  },

  descripcion: { type: String },
  disponible: { type: Boolean, default: true },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
});

//metodo para sobreescribir el metodo .toJSON y asi capturara campos que no quiero que se vean en la res de las consultas
ProductoSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();

  return data;
};

module.exports = model("Producto", ProductoSchema);
