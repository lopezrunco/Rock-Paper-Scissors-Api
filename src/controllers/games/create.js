const Joi = require('joi')
const { gameModel } = require('../../models/game')

module.exports = (request, response) => {
    const game = request.body

    const schema = Joi.object({
        playerOneId: Joi.string()
            .alphanum()
            .required(),
        playerTwoId: Joi.string()
            .alphanum()
            .required(),
    })

    const validationResult = schema.validate(game)

    if (!validationResult.error) {
        gameModel.create({
            playerOneId: game.playerOneId,
            playerTwoId: game.playerTwoId
        }).then(game => {
            response.status(200).json({
                message: 'Juego creado'
            })
        }).catch(error => {
            response.status(500).json({
                message: 'No se pudo crear el juego'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}