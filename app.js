require("dotenv").config()

const Server=require("./models/server")


//creamos un web server mediante la clase que creamos trasladando el codigo habitual a clase
const server= new Server()

//lanzamos la instancia del servidor
server.listen()



//CODIGO HABITUAL PARA CREAR UN WEBSERVER
// const express = require('express')
// const app = express()

// app.get('/',  (req, res)=> {
//   res.send('Hello World')
  
// })

// app.listen(process.env.PORT,()=>{
//     console.log("Servidor express corriendo en puerto", process.env.PORT)
// })


