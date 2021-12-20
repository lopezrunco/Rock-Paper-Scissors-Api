const bcrypt = require('bcrypt')
const otplib = require('otplib')
const { userModel } = require('../../models/user')
const createToken = require('../../utils/create-token')
const { CONSUMER_TOKEN_TYPE, REFRESH_TOKEN_TYPE } = require('../../utils/token-types')

const returnCredentials = (user, response) => {
    // Se eliminan los campos que no se mostraran en la respuesta
    const userWithoutPasswords = user.toJSON()

    delete userWithoutPasswords.password
    delete userWithoutPasswords.mfaSecret

    // Se agrega token y refresh token al usuario
    userWithoutPasswords.token = createToken(user, CONSUMER_TOKEN_TYPE, '30m')
    userWithoutPasswords.refreshToken = createToken(user, REFRESH_TOKEN_TYPE, '3d')

    // Se retorna el usuario
    response.json({
        user: userWithoutPasswords
    })
}

module.exports = (request, response) => {
    userModel.findOne({ nickname: request.body.nickname })    // Busca el usuario por el nickname
        .then(user => {
            if (user) {
                // Si existe el usuario, compara la password ingresada con la password guardada en la database
                const match = bcrypt.compareSync(request.body.password, user.password)

                // Se aplica si las passwords coinciden
                if (match) {
                    // Chequea si el usuario tiene MFA habilitado
                    if (user.mfaEnabled) {
                        try {
                            // Valida el token generado por la app
                            const mfaTokenValid = otplib.authenticator.check(request.body.token, user.mfaSecret)

                            if (mfaTokenValid) {
                                returnCredentials(user, response)
                            } else {
                                console.error('Invalid MFA token')
                                response.status(401).end()
                            }
                        } catch (error) {
                            console.error('Error trying to validate MFA token', error)
                            response.status(401).end()
                        }
                    } else {
                        returnCredentials(user, response)
                    }
                } else {
                    console.error('Password not match')
                    response.status(401).end()
                }
            } else {
                console.error('User not found')
                response.status(401).end()
            }
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to login'
            })
        })
}