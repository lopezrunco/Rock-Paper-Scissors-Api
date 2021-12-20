require('dotenv').config()  // Utilidad para leer variables de entorno

// Dependencias externas
const bcrypt = require('bcrypt')
const faker = require('faker')
const mongoose = require('mongoose')
const getDbConnectionString = require('../utils/get-db-connection-string')  // Retorna el string de conexion

// Modelo a utilizar 
const { userModel } = require('../models/user')

// Declaracion de las listas de documentos a insertar en las colecciones
const users = []
// Contrasena que se utilizara en los usuarios
const userPassword = bcrypt.hashSync('super_mega_secret', 2)
// Cantidad de usuarios a generar
const numberOfUsers = 10

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

// Muestra en la consola informacion sobre la inserción de datos
console.log('------------------------------------------------------------------------')
console.log('Seeder running')
console.log('------------------------------------------------------------------------')
console.log(`Will be inserted ${numberOfUsers} users`)
console.log('------------------------------------------------------------------------')

// Conexion a la base de datos
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Promise.all acepta una coleccion de promesas
        Promise.all([
            // Inserta los usuarios
            userModel.insertMany(users)
        ]).then(() => {
            // Luego de insertarse los datos, cierra la conexion
            console.log('Listo!')
            console.log('------------------------------------------------------------------------')
            mongoose.connection.close()
        })
    }).catch(error => {
        console.error('Could not connect to database', error)
    })