const mongoose = require("mongoose");

const dbConecction = async () => {
  try {
    //conexion a la bd mongo en la nube
    await mongoose.connect(process.env.MONGODB_CONECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB ONLINE!!");
  } catch (error) {
    console.log(error);
    throw new Error("Error al iniciar la BD");
  }
};

module.exports = {
  dbConecction,
};
