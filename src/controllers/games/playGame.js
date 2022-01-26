const Joi = require('joi')
const { gameModel } = require('../../models/game')

module.exports = (request, response) => {
    const actualPlayer = request.user.id
    const playerChoice = request.body.choice

    const schema = Joi.object({
        userId: Joi.string()
            .alphanum()
            .required(),
        choice: Joi.number()
            .allow(1, 2, 3)
            .required()
    })

    const validationResult = schema.validate({
        userId: actualPlayer,
        choice: playerChoice
    })

    if (!validationResult.error) {
        gameModel
            .findOne({ _id: request.params.id })
            .then(game => {
                // Matchea que usuario esta logueado y de acuerdo a eso empuja la juagada al array de jugadas
                if (actualPlayer === game.playerOneId) {
                    const playerOneMove = playerChoice
                    game.playerOneMoves.push(playerOneMove)
                } else {
                    const playerTwoMove = playerChoice
                    game.playerTwoMoves.push(playerTwoMove)
                }
                game.save()
            }).then(() => {
                response.status(200).json({
                    message: 'Played!'
                })
            }).catch(error => {
                console.error(error)
                response.status(500).json({
                    message: 'Error trying to update the game'
                })
            })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }

}