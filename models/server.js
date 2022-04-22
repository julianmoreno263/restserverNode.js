const express = require("express");
const cors = require('cors')


class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath="/api/usuarios"

    //MIDDLEWARES
    this.middlewares();
    

    //RUTAS DE MI APLICACION
    this.routes();
  }

  middlewares() {
    
    //permitir ciertas urls usando el paquete CORS
    this.app.use(cors())

    //middleware para capturar los datos de la peticion (cuando el usuario envia datos)
    this.app.use(express.json())

    //Busca carpeta public
    this.app.use(express.static("public"));

  }

  routes() {
    this.app.use( this.usuariosPath,require("../routes/usuarios"))
  }



  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor express corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
