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
                message: 'New game created'
            })
        }).catch(error => {
            response.status(500).json({
                message: 'Could not create the new game'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}