const bcrypt = require('bcrypt')
const Joi = require('joi')
const { userModel } = require('../../models/user')
const createToken = require('../../utils/create-token')
const { CONSUMER_TOKEN_TYPE, REFRESH_TOKEN_TYPE } = require('../../utils/token-types')

module.exports = (request, response) => {
    // Crea el usuario con los datos que vienen en el body
    const user = request.body

    // Se usa Joi para la validacion del usuario
    const schema = Joi.object({
        nickname: Joi.string()
            .alphanum()
            .required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(7)
            .max(50)
            .required()
    })

    // Se valida el usuario a crear contra el esquema 
    const validationResult = schema.validate(user)

    // Si no hay errores, se registra el usuario
    if (!validationResult.error) {

        // Usando bcrypt, se hashea la password del usuario
        user.password = bcrypt.hashSync(user.password, 2)

        // Guarda el usuario en la base de datos
        userModel.create({
            nickname: user.nickname,
            email: user.email,
            password: user.password,

        }).then(user => {

            // Se obtiene el usuario de forma plana
            const userWithoutPasswords = user.toObject()

            // Se borran los datos que no se mostraran en la respuesta
            delete userWithoutPasswords.password
            delete userWithoutPasswords.mfaSecret

            // Agrega token y refresh token al usuario
            userWithoutPasswords.token = createToken(user, CONSUMER_TOKEN_TYPE, '30m')
            userWithoutPasswords.refreshToken = createToken(user, REFRESH_TOKEN_TYPE, '3d')

            // Se retorna la informacion del usuario sin datos sensibles
            response.json({
                user: userWithoutPasswords
            })

        }).catch(error => {
            response.status(500).json({
                message: 'Could not register the user'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}