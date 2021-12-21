require('dotenv').config()  // Utilidad para leer variables de entorno

// Dependencias externas
const bcrypt = require('bcrypt')
const faker = require('faker')
const mongoose = require('mongoose')
const getDbConnectionString = require('../utils/get-db-connection-string')  // Retorna el string de conexion

// Modelo a utilizar 
const { userModel } = require('../models/user')
const { gameModel } = require('../models/game')

// Declaracion de las listas de documentos a insertar en las colecciones
const users = []
const games = []
// Contrasena que se utilizara en los usuarios
const userPassword = bcrypt.hashSync('super_mega_secret', 2)
// Cantidad de usuarios a generar
const numberOfUsers = 5
const numberOfGames = 20

// Generacion de los usuarios usando faker.js
for (let iterationIndex = 0; iterationIndex < numberOfUsers; iterationIndex++) {
    users.push({
        nickname: faker.internet.userName(),
        email: faker.internet.email(),
        password: userPassword,
        mfaEnabled: false,
        mfaSecret: ''
    })
}

// Generacion de los juegos usando faker.js
for (let gameIterationIndex = 0; gameIterationIndex < numberOfGames; gameIterationIndex++) {
    games.push({
        playerOneId: faker.datatype.hexaDecimal(),
        playerTwoId: faker.datatype.hexaDecimal(),
        playerOneMoves: faker.datatype.array(),
        playerTwoMoves: faker.datatype.array(),
        movesWinners: faker.datatype.array(),
        completed: false,
        winnerId: faker.datatype.hexaDecimal()
    })
}

// Muestra en la consola informacion sobre la inserción de datos
console.log('------------------------------------------------------------------------')
console.log('Seeder running')
console.log('------------------------------------------------------------------------')
console.log(`Will be inserted ${numberOfUsers} users and ${numberOfGames} games`)
console.log('------------------------------------------------------------------------')

// Conexion a la base de datos
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Promise.all acepta una coleccion de promesas
        Promise.all([
            // Inserta los usuarios
            userModel.insertMany(users),
            gameModel.insertMany(games)
        ]).then(() => {
            // Luego de insertarse los datos, cierra la conexion
            console.log('Listo!')
            console.log('------------------------------------------------------------------------')
            mongoose.connection.close()
        })
    }).catch(error => {
        console.error('Could not connect to database', error)
    })