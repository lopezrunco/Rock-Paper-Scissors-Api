const otplib = require('otplib')
const qrcode = require('qrcode')
const crypto = require('crypto')
const { userModel } = require('../../models/user')

otplib.authenticator.options = { crypto }

// Este controlador se llama desde la UI para habilitar el multifactor.
// Se llama cuando el usuario ya esta logueado, entonces se pueden obtener datos
// como el email, id, etc, seteados anteriormente desde el middleware
module.exports = (request, response) => {
    const secret = otplib.authenticator.encode(
        crypto.randomBytes(32).toString('hex').substr(0, 20)
    )

    // Estos datos se mostraran en la app de autenticacion
    const email = request.user.email
    const service = 'RPS GameApp'

    const otpAuth = otplib.authenticator.keyuri(email, service, secret)

    // Con los datos que recibe, esta funcion genera un QR (url de datos en base64)
    qrcode.toDataURL(otpAuth)   // Genera el QR
        .then(qr => {
            // Con el QR obtenido, busca el usuario por el ID (seteado en el token que se inyecto en el middleware)
            // Solo habilitara el MFA si el mismo esta deshabilitado
            // Lo actualiza a MFA activado y le asigna la clave secreta
            userModel.findOneAndUpdate({ _id: request.user.id, mfaEnabled: false }, { mfaEnabled: true, mfaSecret: secret })
                .then((user) => {
                    // Si existe el usuario, retorna QR y clave secreta
                    if (user) {
                        response.json({
                            qr,
                            secret
                        })
                    } else {
                        response.json({
                            message: 'Could not enable MFA'
                        })
                    }
                }).catch(error => {
                    console.error('Error trying to enable MFA', error)
                    response.status(500).json({
                        message: 'Error trying to enable MFA'
                    })
                })
        }).catch(error => {
            console.error('Error trying to generate QR', error)
            response.status(500).json({
                message: 'Error trying to generate QR'
            })
        })
}