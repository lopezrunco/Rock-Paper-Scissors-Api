const { gameModel } = require('../../models/game')

module.exports = (request, response) => {
    const actualPlayer = request.user.id
    const playerChoice = request.body

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
}