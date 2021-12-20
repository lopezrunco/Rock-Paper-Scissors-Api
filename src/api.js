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

const checkUserCredentials = require('./middlewares/check-user-credentials')

app.use(cors())

// Esta linea es para entender el JSON que se le envia a la API
app.use(express.json())

// -------------------------------------------------------------------------------------------------- //
// Carga de controladores
// -------------------------------------------------------------------------------------------------- //

// Seguridad
const refresh = require('./controllers/auth/refresh')
const enableMfa = require('./controllers/auth/enable-mfa')

// Usuarios
const login = require('./controllers/user/login')
const register = require('./controllers/user/register')

// -------------------------------------------------------------------------------------------------- //
// Definicion de rutas
// -------------------------------------------------------------------------------------------------- //

// Usuarios
app.post('/login', login)
app.post('/register', register)

// Juegos
// app.post('/games/create', createGame)
// app.get('/games/on-play', getOnPlayGames)
// app.get('/games/on-play/:id', getGameById)
// app.post('/games/play/:id', playGame)
// app.get('/games/history', getGamesHistory)

// Usa las credenciales importadas para conectar a la base de datos
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Comienza a escuchar por conexiones
        app.listen(process.env.PORT)
    }).catch(error => {
        console.error('Could not connect to the database', error)
    })