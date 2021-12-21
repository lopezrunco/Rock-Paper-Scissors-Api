const { gameModel } = require('../../models/game')

module.exports = (request, response) => {
    gameModel
        .findOne({ _id: request.params.id })  // Obtiene el juego mediante los parametros de url
        .select('-playerOneMoves, -playerTwoMoves, -movesWinners,') // Excluye campos
        .then(game => {
            response.status(200).json({
                game
            })
        }).catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to get the game'
            })
        })
}