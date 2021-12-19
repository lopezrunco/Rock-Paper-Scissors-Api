const express = require('express')
const bodyParser = require('body-parser')

// -------------------------------------------------------------------------------------------------- //
// Creacion de la app express 
// -------------------------------------------------------------------------------------------------- //

const app = express()
const port = 3000

// -------------------------------------------------------------------------------------------------- //
// Middlewares
// -------------------------------------------------------------------------------------------------- //

app.use(bodyParser.json())

// -------------------------------------------------------------------------------------------------- //
// Definicion de rutas
// -------------------------------------------------------------------------------------------------- //

// Juegos
app.post('/games/create', createGame)
app.get('/games/on-play', getOnPlayGames)
app.get('/games/on-play/:id', getGameById)
app.post('/games/play/:id', playGame)
app.get('/games/history', getGamesHistory)

app.listen(port)