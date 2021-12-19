// Carga las variables de entorno usando la biblioteca dotenv
require('dotenv').config()

const mongoose = require('mongoose') // Mapeador para mongo db
const mongooseToJson = require('@meanie/mongoose-to-json') // Limpia las request en los campos _id y __v
const express = require('express')
const cors = require('cors') // Abre la API en terminos de seguridad. Permite conexiones entre una misma IP
const getDbConnectionString = require('./utils/get-db-connection-string') // Retorna el string de conexion

mongoose.plugin(mongooseToJson) // Carga del plugin mongooseToJson en mongoose

// -------------------------------------------------------------------------------------------------- //
// Creacion de la app express 
// -------------------------------------------------------------------------------------------------- //

const app = express()

// -------------------------------------------------------------------------------------------------- //
// Middlewares
// -------------------------------------------------------------------------------------------------- //

app.use(cors())

app.use(express.json())

// -------------------------------------------------------------------------------------------------- //
// Definicion de rutas
// -------------------------------------------------------------------------------------------------- //

// Juegos
app.post('/games/create', createGame)
app.get('/games/on-play', getOnPlayGames)
app.get('/games/on-play/:id', getGameById)
app.post('/games/play/:id', playGame)
app.get('/games/history', getGamesHistory)

// Usa las credenciales importadas para conectar a la base de datos
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Comienza a escuchar por conexiones
        app.listen(process.env.PORT)
    }).catch(error => {
        console.error('No se pudo conectar a la base de datos', error)
    })