const jwt = require('jsonwebtoken')

// Por defecto, el middleware chequea si el token es de tipo CONSUMER, si en la funcion viene el valor REFRESH, chequea con ese tipo
module.exports = (tokenType = 'CONSUMER') => {
    return (request, response, next) => {

        // Se obtiene la autorizacion del header de la request
        const token = request.headers.authorization

        try {
            // Valida que el token enviado por el usuario sea correcto
            const decoded = jwt.verify(token, process.env.JWT_KEY)

            // Chequea el tipo de token
            if (decoded.type === tokenType) {
                // Inserta los datos del usuario en la request
                request.user = {
                    id: decoded.id,
                    name: decoded.name,
                    email: decoded.email
                }

                // Inserta informacion del token en la request, para acceder a ella despues del middleware
                request.token = {
                    value: token,
                    type: decoded.type
                }

                // Se invoca el siguiente middleware
                next()
            } else {
                return response.status(401).json({
                    message: 'Invalid token type'
                })
            }
        } catch (error) {
            console.error('Error en el token', error)
            return response.status(401).json({
                message: 'Invalid credentials'
            })
        }
    }
}